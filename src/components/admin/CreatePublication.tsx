import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Image as ImageIcon, Send, Type } from "lucide-react";
import publicationService from "../../services/publication.service";
import authService from "../../services/auth.service";

interface PublicationForm {
  title: string;
  content: string;
  imageUrl: string;
  validFrom: string;
  validTo: string;
  category: string;
  sendNewsletter: boolean;
}

export default function CreatePublication() {
  const navigate = useNavigate();
  const [publication, setPublication] = useState<PublicationForm>({
    title: "",
    content: "",
    imageUrl: "",
    validFrom: new Date().toISOString().split('T')[0], // Default to today
    validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 30 days from now
    category: "news",
    sendNewsletter: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login", { 
        state: { from: "/admin/publications/create" } 
      });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate dates
      const fromDate = new Date(publication.validFrom);
      const toDate = new Date(publication.validTo);
      
      if (fromDate > toDate) {
        throw new Error("Valid from date must be before valid to date");
      }

      console.log("Creating publication:", publication);
      const createdPublication = await publicationService.createPublication({
        ...publication,
        validFrom: new Date(publication.validFrom).toISOString(),
        validTo: new Date(publication.validTo).toISOString(),
      });
      
      console.log("Publication created:", createdPublication);
      navigate("/admin/publications");
    } catch (err: any) {
      console.error("Error creating publication:", err);
      setError(
        err.response?.data?.message || 
        "Failed to create publication. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setPublication((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPublication((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Create Publication
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Type className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="title"
              id="title"
              value={publication.title}
              onChange={handleInputChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              required
              placeholder="Enter publication title"
            />
          </div>
        </div>

        {/* Content Field */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content
          </label>
          <textarea
            name="content"
            id="content"
            rows={6}
            value={publication.content}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Write your publication content here"
            required
          />
        </div>

        {/* Image URL Field */}
        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Image URL (Optional)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ImageIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              name="imageUrl"
              id="imageUrl"
              value={publication.imageUrl}
              onChange={handleInputChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Date Range Fields */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="validFrom"
              className="block text-sm font-medium text-gray-700"
            >
              Valid From
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="validFrom"
                id="validFrom"
                value={publication.validFrom}
                onChange={handleInputChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="validTo"
              className="block text-sm font-medium text-gray-700"
            >
              Valid To
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="validTo"
                id="validTo"
                value={publication.validTo}
                onChange={handleInputChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        </div>

        {/* Category Field */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            name="category"
            id="category"
            value={publication.category}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="news">News</option>
            <option value="blog">Blog</option>
            <option value="event">Event</option>
            <option value="announcement">Announcement</option>
          </select>
        </div>

        {/* Newsletter Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="sendNewsletter"
            id="sendNewsletter"
            checked={publication.sendNewsletter}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label 
            htmlFor="sendNewsletter" 
            className="ml-2 block text-sm text-gray-900"
          >
            Send Newsletter
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Create Publication
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}