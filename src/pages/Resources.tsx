import React, { useState, useEffect } from "react";
import { Book, Upload, Download, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { generatePdfThumbnail } from "../utils/pdfThumbnail";

interface Resource {
  id: string;
  name: string;
  description: string;
  file_url: string;
  thumbnail_url: string | null;
  created_at: string;
  user_id: string;
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    file: null as File | null,
    thumbnail: null as File | null,
  });

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    resources.forEach(async (resource) => {
      if (!resource.thumbnail_url && !thumbnails[resource.id]) {
        try {
          const thumbnail = await generatePdfThumbnail(resource.file_url);
          setThumbnails((prev) => ({
            ...prev,
            [resource.id]: thumbnail,
          }));
        } catch (error) {
          console.error("Error generating thumbnail:", error);
        }
      }
    });
  }, [resources]);

  const fetchResources = async () => {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setResources(data);
    }
    setLoading(false);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "file" | "thumbnail"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "file" && !file.type.includes("pdf")) {
        alert("Only PDF files are allowed");
        return;
      }
      if (type === "thumbnail" && !file.type.includes("image")) {
        alert("Only image files are allowed for thumbnails");
        return;
      }
      setFormData({ ...formData, [type]: file });
    }
  };

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from("resources")
      .upload(path, file);

    if (error) throw error;
    return supabase.storage.from("resources").getPublicUrl(path).data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return;

    try {
      setUploading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const fileUrl = await uploadFile(
        formData.file,
        `${user.id}/${Date.now()}-${formData.file.name}`
      );

      let thumbnailUrl = null;
      if (formData.thumbnail) {
        thumbnailUrl = await uploadFile(
          formData.thumbnail,
          `${user.id}/thumbnails/${formData.thumbnail.name}`
        );
      }

      const { data, error } = await supabase.from("resources").insert([
        {
          name: formData.name,
          description: formData.description,
          file_url: fileUrl,
          thumbnail_url: thumbnailUrl,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      setFormData({ name: "", description: "", file: null, thumbnail: null });
      setShowForm(false);
      fetchResources();
    } catch (error) {
      console.error("Error uploading resource:", error);
      alert("Error uploading resource. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading resources...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Book className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-2 text-3xl font-bold text-white">Resources</h2>
          <p className="mt-2 text-lg text-gray-300">
            Share and access learning materials
          </p>
        </div>

        {!showForm ? (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Resource
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto mb-12 bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Upload New Resource</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">
                  PDF File
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => handleFileChange(e, "file")}
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">
                  Thumbnail (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "thumbnail")}
                  className="mt-1 block w-full"
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9">
                {resource.thumbnail_url ? (
                  <img
                    src={resource.thumbnail_url}
                    alt={resource.name}
                    className="w-full h-48 object-cover"
                  />
                ) : thumbnails[resource.id] ? (
                  <img
                    src={thumbnails[resource.id]}
                    alt={resource.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-600 flex items-center justify-center">
                    <div className="animate-pulse">
                      <Book className="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-white">
                  {resource.name}
                </h3>
                <p className="mt-1 text-sm text-gray-300">
                  {resource.description}
                </p>
                <div className="mt-4">
                  <a
                    href={resource.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
