import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { LogOut, Trash2, Plus, ArrowLeft } from "lucide-react";

type MediaRow = {
  id: string;
  type: "image" | "youtube";
  url: string;
  alt: string;
  storage_path: string | null;
  sort_order: number;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/admin/community")({
  head: () => ({
    meta: [
      { title: "Admin — Community Event | TurboLoop" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminCommunity,
});

// Extract 11-char YouTube id from URL or accept id directly.
function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const m = trimmed.match(/(?:v=|\/embed\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read banner image"));
    reader.readAsDataURL(file);
  });
}

function AdminCommunity() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState<"image" | "youtube">("image");
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [sort, setSort] = useState("0");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { navigate({ to: "/auth" }); return; }
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!roleData);
      await refresh();
      setLoading(false);
    })();
  }, [navigate]);

  const refresh = async () => {
    const { data, error } = await supabase
      .from("community_media")
      .select("id, type, url, alt, storage_path, sort_order, created_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) { toast.error(error.message); return; }
    setRows((data ?? []) as MediaRow[]);
  };

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalUrl = url.trim();
      let customBanner: string | null = null;
      if (type === "youtube") {
        const id = extractYoutubeId(finalUrl);
        if (!id) throw new Error("Invalid YouTube URL or ID");
        finalUrl = id;
        if (bannerFile) {
          if (!bannerFile.type.startsWith("image/")) throw new Error("Banner must be an image file");
          if (bannerFile.size > 500_000) throw new Error("Banner must be 500 KB or smaller");
          customBanner = await readAsDataUrl(bannerFile);
        }
      } else {
        if (!/^https?:\/\//i.test(finalUrl)) throw new Error("Image URL must start with http(s)://");
      }
      const { error } = await supabase.from("community_media").insert({
        type,
        url: finalUrl,
        alt: alt.trim(),
        storage_path: customBanner,
        sort_order: Number(sort) || 0,
      });
      if (error) throw error;
      toast.success("Media added");
      setUrl(""); setAlt(""); setBannerFile(null); setSort("0");
      await refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to add");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this media?")) return;
    const { error } = await supabase.from("community_media").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    await refresh();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <Card className="glass p-8 max-w-md text-center">
          <h1 className="text-xl font-bold mb-2">Not authorized</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Your account doesn't have admin privileges.
          </p>
          <Button onClick={signOut} variant="outline">Sign out</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link to="/" className="shrink-0"><Logo /></Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold truncate">Community Event Admin</h1>
            <p className="text-xs text-muted-foreground">Add or remove images & YouTube videos</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/"><Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-1" />Site</Button></Link>
          <Button variant="outline" size="sm" onClick={signOut}><LogOut className="h-4 w-4 mr-1" />Sign out</Button>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Add form */}
        <Card className="glass p-5 h-fit">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Plus className="h-4 w-4" />Add media</h2>
          <form onSubmit={onAdd} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as "image" | "youtube")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image (URL)</SelectItem>
                  <SelectItem value="youtube">YouTube video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="url">{type === "image" ? "Image URL" : "YouTube URL or ID"}</Label>
              <Input
                id="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={type === "image" ? "https://..." : "https://youtube.com/watch?v=..."}
              />
            </div>
            {type === "youtube" && (
              <div className="space-y-1.5">
                <Label htmlFor="banner">Optional custom square banner</Label>
                <Input
                  key={bannerFile?.name ?? "default-banner"}
                  id="banner"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use the YouTube thumbnail. For the square card, use a 1:1 image up to 500 KB.
                </p>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="alt">Caption / alt text</Label>
              <Input id="alt" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Community meetup" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sort">Sort order</Label>
              <Input id="sort" type="number" value={sort} onChange={(e) => setSort(e.target.value)} />
              <p className="text-xs text-muted-foreground">Lower = shown first.</p>
            </div>
            <Button type="submit" disabled={saving} className="w-full gradient-primary text-primary-foreground font-semibold">
              {saving ? "Saving…" : "Add media"}
            </Button>
          </form>
        </Card>

        {/* List */}
        <div>
          <h2 className="font-semibold mb-4">Current media ({rows.length})</h2>
          {rows.length === 0 ? (
            <Card className="glass p-8 text-center text-sm text-muted-foreground">
              No media yet. Add your first entry.
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {rows.map((m) => (
                <Card key={m.id} className="glass p-3 space-y-2">
                  <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                    {m.type === "image" ? (
                      <img src={m.url} alt={m.alt} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <img src={m.storage_path || `https://i.ytimg.com/vi/${m.url}/hqdefault.jpg`} alt={m.alt} loading="lazy" className="h-full w-full object-cover" />
                    )}
                    <span className="absolute top-1 left-1 rounded bg-background/80 px-1.5 py-0.5 text-[10px] uppercase font-bold">
                      {m.type}
                    </span>
                  </div>
                  <p className="text-xs truncate">{m.alt || <span className="text-muted-foreground italic">no caption</span>}</p>
                  <p className="text-[10px] text-muted-foreground truncate">Order: {m.sort_order}{m.type === "youtube" && m.storage_path ? " · custom banner" : ""}</p>
                  <Button variant="destructive" size="sm" className="w-full" onClick={() => onDelete(m.id)}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
