'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  reply_message?: string;
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setContacts(data || []);
    setLoading(false);
  };

  const markAsReplied = async (id: string) => {
    setSaving(true);
    const { error } = await supabase
      .from('contacts')
      .update({ 
        status: 'replied',
        reply_message: replyText.trim() || null 
      })
      .eq('id', id);

    if (!error) {
      fetchContacts();
      setReplyText('');
      setSelectedContact(null);
    }
    setSaving(false);
  };

  const deleteContact = async (id: string) => {
    if (!confirm("确定删除这条留言吗？")) return;

    setDeleting(id);
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (!error) {
      fetchContacts();
      if (selectedContact?.id === id) setSelectedContact(null);
    }
    setDeleting(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Admin - Contact Messages</h1>
          <div className="flex gap-6">
            <Link href="/admin" className="text-black hover:underline">← Back to Admin</Link>
            <button onClick={() => {
              localStorage.removeItem('admin-auth');
              window.location.href = '/admin';
            }} className="text-red-600 hover:text-red-700">
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 留言列表 */}
          <div className="bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-6">All Messages ({contacts.length})</h2>
            {contacts.length === 0 ? (
              <p className="text-gray-500 py-10 text-center">No messages yet.</p>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-5 border rounded-2xl cursor-pointer hover:border-black transition ${
                      selectedContact?.id === contact.id ? 'border-black bg-gray-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                        <p className="mt-1 font-medium line-clamp-1">{contact.subject}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteContact(contact.id); }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 回复区域 */}
          <div className="bg-white rounded-3xl shadow p-8">
            {selectedContact ? (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Reply to Message</h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p>{selectedContact.name} ({selectedContact.email})</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Subject</p>
                    <p className="font-medium">{selectedContact.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Message</p>
                    <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Your Reply</p>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full h-40 p-4 border rounded-2xl"
                      placeholder="Write your reply here..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button
                    onClick={() => markAsReplied(selectedContact.id)}
                    disabled={saving}
                    className="flex-1 bg-black text-white py-4 rounded-2xl font-medium hover:bg-gray-800 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Reply & Mark as Replied"}
                  </button>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="flex-1 border py-4 rounded-2xl hover:bg-gray-100"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Select a message from the left
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}