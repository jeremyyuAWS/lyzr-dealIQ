import { useState } from 'react';
import { Upload, Link as LinkIcon, X, Edit2, Check, Tag } from 'lucide-react';

interface Attachment {
  type: 'file' | 'url';
  name: string;
  url: string;
  size?: number;
  displayName?: string;
  description?: string;
  tags?: string[];
}

interface AttachmentCardProps {
  attachment: Attachment;
  index: number;
  onUpdate: (index: number, updates: Partial<Attachment>) => void;
  onRemove: (index: number) => void;
}

export default function AttachmentCard({ attachment, index, onUpdate, onRemove }: AttachmentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDisplayName, setEditedDisplayName] = useState(attachment.displayName || attachment.name);
  const [editedDescription, setEditedDescription] = useState(attachment.description || '');
  const [tagInput, setTagInput] = useState('');

  const handleSave = () => {
    onUpdate(index, {
      displayName: editedDisplayName,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const newTags = [...(attachment.tags || []), tagInput.trim()];
      onUpdate(index, { tags: newTags });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagIndex: number) => {
    const newTags = attachment.tags?.filter((_, i) => i !== tagIndex) || [];
    onUpdate(index, { tags: newTags });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="p-2 bg-gray-50 rounded-lg mt-0.5">
            {attachment.type === 'url' ? (
              <LinkIcon className="h-4 w-4 stroke-black" />
            ) : (
              <Upload className="h-4 w-4 stroke-black" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editedDisplayName}
                onChange={(e) => setEditedDisplayName(e.target.value)}
                className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Display name"
              />
            ) : (
              <div>
                <h4 className="text-sm font-medium text-black truncate">
                  {attachment.displayName || attachment.name}
                </h4>
                {attachment.displayName && attachment.displayName !== attachment.name && (
                  <p className="text-xs text-gray-500 truncate">{attachment.name}</p>
                )}
              </div>
            )}

            {attachment.size && (
              <p className="text-xs text-gray-500 mt-0.5">{formatFileSize(attachment.size)}</p>
            )}

            {isEditing ? (
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full mt-2 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black resize-none"
                rows={2}
                placeholder="Add description..."
              />
            ) : attachment.description ? (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{attachment.description}</p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {isEditing ? (
            <button
              type="button"
              onClick={handleSave}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Save"
            >
              <Check className="h-4 w-4 stroke-green-600" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Edit"
            >
              <Edit2 className="h-4 w-4 stroke-black" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Remove"
          >
            <X className="h-4 w-4 stroke-black" />
          </button>
        </div>
      </div>

      {attachment.tags && attachment.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {attachment.tags.map((tag, tagIdx) => (
            <span
              key={tagIdx}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-xs text-gray-700 rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tagIdx)}
                className="hover:text-black"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
          placeholder="Add tag..."
          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          title="Add tag"
        >
          <Tag className="h-3.5 w-3.5 stroke-black" />
        </button>
      </div>
    </div>
  );
}
