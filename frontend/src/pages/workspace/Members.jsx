import { useState, useEffect } from "react";
import { Plus, Mail, X, Loader2, Trash2 } from "lucide-react";
import api from "../../utils/axiosinstance";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

const Members = () => {
  const { activeWorkspaceId, isSessionRestored } = useAuthStore();
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!isSessionRestored || !activeWorkspaceId) return;

    const fetchData = async () => {
      if (!activeWorkspaceId) return;
      setIsLoading(true);
      try {
        const [membersRes, invitesRes] = await Promise.all([
          api.get(`/api/v1/workspaces/${activeWorkspaceId}/members`),
          api.get(`/api/v1/workspaces/${activeWorkspaceId}/invites`),
        ]);

        setMembers(membersRes.data.data || []);
        setInvites(invitesRes.data.data || []);
      } catch (error) {
        toast.error("Failed to load team data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeWorkspaceId, isSessionRestored]);

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setIsSending(true);
    try {
      await api.post(`/api/v1/workspaces/${activeWorkspaceId}/invites`, {
        email: inviteEmail,
      });
      toast.success("Invitation sent successfully");
      setShowModal(false);
      setInviteEmail("");

      // Refresh pending invites list
      const invitesRes = await api.get(
        `/api/v1/workspaces/${activeWorkspaceId}/invites`,
      );
      setInvites(invitesRes.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send invite");
    } finally {
      setIsSending(false);
    }
  };

  const handleRevokeInvite = async (inviteId) => {
    try {
      await api.delete(
        `/api/v1/workspaces/${activeWorkspaceId}/invites/${inviteId}`,
      );
      toast.success("Invitation revoked");
      setInvites(invites.filter((inv) => inv._id !== inviteId));
    } catch (error) {
      toast.error("Failed to revoke invite");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0344a6]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172b4d]">Team Members</h1>
          <p className="text-[#172b4d]/60 mt-1">
            Manage your workspace roster and pending invitations.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0344a6] text-white text-sm font-semibold rounded-lg hover:bg-[#0344a6]/90 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> Invite Member
        </button>
      </div>

      {/* Pending Invites */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-sm font-semibold text-[#172b4d] uppercase tracking-wider">
            Pending Invitations ({invites.length})
          </h2>
        </div>
        <div className="divide-y divide-slate-200">
          {invites.length > 0 ? (
            invites.map((invite) => (
              <div
                key={invite._id}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0344a6]/10 text-[#0344a6] flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#172b4d]">
                      {invite.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRevokeInvite(invite._id)}
                  className="text-[#172b4d]/40 hover:text-red-500 transition-colors p-2"
                  aria-label="Revoke invite"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-sm text-[#172b4d]/60">
              No pending invitations.
            </div>
          )}
        </div>
      </div>

      {/* Active Members */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-sm font-semibold text-[#172b4d] uppercase tracking-wider">
            Active Members ({members.length})
          </h2>
        </div>
        <div className="divide-y divide-slate-200">
          {members.map((member) => (
            <div
              key={member._id}
              className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0344a6]/10 text-[#0344a6] text-xs font-bold flex items-center justify-center">
                  {member.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#172b4d]">
                    {member.name || "Member"}
                  </p>
                  <p className="text-xs text-[#172b4d]/60">
                    {member.email || ""}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${member.role === "admin" ? "bg-[#0344a6]/10 text-[#0344a6]" : "bg-slate-100 text-[#172b4d]/70"}`}
              >
                {member.role === "admin" ? "Admin" : "Member"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172b4d]/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-[#172b4d]">
                Invite Team Member
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#172b4d]/40 hover:text-[#172b4d]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSendInvite} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#172b4d] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-[#172b4d] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0344a6] focus:border-transparent"
                  placeholder="employee@company.com"
                />
                <p className="mt-1.5 text-xs text-[#172b4d]/50">
                  They will receive a secure magic link to join the workspace.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-[#172b4d] font-semibold rounded-lg border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex-1 px-6 py-2.5 bg-[#0344a6] hover:bg-[#0344a6]/90 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Send Invite"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
