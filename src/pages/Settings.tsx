import React, { useState, useEffect } from "react";
import AppLayout from "../components/Layout";
import { useAuth } from "../lib/auth-context";
import { db } from "../lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Shield, ShieldAlert, CheckCircle2, UserCheck, UserX, Clock, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const { user, role } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    if (role === "admin") {
      fetchUsers();
    }
  }, [role]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      const usersData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(usersData);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUpdateUserStatus = async (
    userId: string,
    newStatus: "approved" | "pending" | "rejected",
    newRole?: "admin" | "user" | "farmer"
  ) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    try {
      const payload: any = {
        status: newStatus,
        role: newRole || targetUser.role || "user",
        email: targetUser.email,
        name: targetUser.name || targetUser.email.split("@")[0],
      };

      await updateDoc(doc(db, "users", userId), payload);
      setUpdateMessage(`User access updated to ${newStatus.toUpperCase()}`);
      setTimeout(() => setUpdateMessage(""), 3500);
      fetchUsers();
    } catch (err: any) {
      console.error("Error updating user status:", err);
      alert("Failed to update user authorization.");
    }
  };

  const pendingUsers = users.filter(
    (u) => u.status === "pending" && u.email !== "klassic.ig@gmail.com"
  );

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="pb-3 border-b border-[#212c24]">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#eff3ef]">
            Settings & Access Control
          </h1>
          <p className="text-xs text-[#95a398] mt-0.5">
            Manage your account credentials and system authorization directory.
          </p>
        </div>

        {/* User Profile Card */}
        <div className="rounded-lg border border-[#222f26] bg-[#141d17] p-4 sm:p-5 shadow-2xs">
          <h2 className="text-sm font-semibold text-[#eff3ef] mb-3 pb-2 border-b border-[#1d2920]">
            Your Account Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#8c9c90] block mb-1">Email Address</span>
              <span className="font-mono text-xs font-semibold text-[#eff3ef]">
                {user?.email}
              </span>
            </div>

            <div>
              <span className="text-[#8c9c90] block mb-1">Account Role & Status</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#18261e] border border-[#274031] rounded text-xs font-medium text-[#7fba96]">
                <Shield className="w-3 h-3" />
                <span>
                  {role === "admin"
                    ? "Administrator (Full Access)"
                    : role === "farmer"
                    ? "Landowner (Farmer Access)"
                    : "Field Operator"}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Pending Requests Alert & Approval Panel */}
        {role === "admin" && pendingUsers.length > 0 && (
          <div className="rounded-lg border border-[#523e25] bg-[#1f1911] p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#382b1b]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#e0a86b]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Pending Registrations Awaiting Approval ({pendingUsers.length})
                </h3>
              </div>
              <span className="text-[11px] text-[#dca364]">
                Direct access is blocked until approved below
              </span>
            </div>

            <div className="divide-y divide-[#2c2217]">
              {pendingUsers.map((pUser) => (
                <div
                  key={pUser.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">{pUser.email}</div>
                    <div className="text-[11px] text-[#a4917a]">
                      Name: {pUser.name || "—"} · Registered:{" "}
                      {pUser.createdAt ? new Date(pUser.createdAt).toLocaleDateString() : "Recent"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateUserStatus(pUser.id, "approved", "user")}
                      className="px-2.5 py-1 text-xs font-semibold bg-[#1f4230] hover:bg-[#28573f] text-white rounded transition-colors flex items-center gap-1"
                    >
                      <UserCheck className="w-3 h-3 text-[#79c294]" />
                      <span>Approve as Operator</span>
                    </button>

                    <button
                      onClick={() => handleUpdateUserStatus(pUser.id, "approved", "farmer")}
                      className="px-2.5 py-1 text-xs font-medium bg-[#1e2f24] hover:bg-[#253d2f] text-[#a5cbb4] rounded transition-colors"
                    >
                      Approve as Landowner
                    </button>

                    <button
                      onClick={() => handleUpdateUserStatus(pUser.id, "rejected")}
                      className="px-2 py-1 text-xs text-[#e47668] hover:bg-[#381c18] rounded transition-colors"
                    >
                      <UserX className="w-3.5 h-3.5 inline mr-1" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Management Table */}
        {role === "admin" && (
          <div className="rounded-lg border border-[#222f26] bg-[#141d17] shadow-2xs overflow-hidden">
            <div className="p-3.5 border-b border-[#212c24] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[#eff3ef]">
                  User Access Directory & Governance
                </h2>
                <p className="text-xs text-[#95a398]">
                  Manage authorization clearance, roles, and operational status.
                </p>
              </div>

              {updateMessage && (
                <span className="text-xs text-[#7fba96] font-medium flex items-center gap-1 bg-[#18261e] px-2 py-0.5 rounded border border-[#274031]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{updateMessage}</span>
                </span>
              )}
            </div>

            {loadingUsers ? (
              <div className="p-6 text-center text-xs text-[#728578]">
                Loading user directory...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] font-semibold text-[#8c9c90] uppercase tracking-wider bg-[#111813] border-b border-[#212c24]">
                    <tr>
                      <th className="px-4 py-2.5">Email</th>
                      <th className="px-4 py-2.5">Name</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5">Role</th>
                      <th className="px-4 py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a251e]">
                    {users.map((u) => {
                      const isOwner = u.email === "klassic.ig@gmail.com";
                      const currentStatus = u.status || (isOwner ? "approved" : "pending");
                      return (
                        <tr
                          key={u.id}
                          className="hover:bg-[#19241d] transition-colors"
                        >
                          <td className="px-4 py-2.5 font-mono text-[#eff3ef]">
                            {u.email}
                            {isOwner && (
                              <span className="ml-2 text-[10px] font-sans px-1.5 py-0.2 rounded bg-[#2e4033] text-[#9ed4b2]">
                                Root Admin
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-[#cad6cd]">
                            {u.name || "—"}
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${
                                currentStatus === "approved"
                                  ? "bg-[#18261e] text-[#7fba96] border-[#274031]"
                                  : currentStatus === "rejected"
                                  ? "bg-[#2c1d1a] text-[#e47668] border-[#4d2823]"
                                  : "bg-[#2c2217] text-[#dfa364] border-[#4d3a24]"
                              }`}
                            >
                              {currentStatus === "approved"
                                ? "Approved"
                                : currentStatus === "rejected"
                                ? "Rejected"
                                : "Pending Approval"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-[#a4b5aa] capitalize">
                              {u.role || "user"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            {isOwner ? (
                              <span className="text-[11px] text-[#63796d]">Protected</span>
                            ) : (
                              <div className="inline-flex items-center gap-1.5">
                                {currentStatus !== "approved" ? (
                                  <button
                                    onClick={() => handleUpdateUserStatus(u.id, "approved", u.role || "user")}
                                    className="px-2 py-1 text-[11px] font-semibold bg-[#1f4230] hover:bg-[#28573f] text-white rounded transition-colors"
                                  >
                                    Grant Access
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateUserStatus(u.id, "rejected", u.role || "user")}
                                    className="px-2 py-1 text-[11px] text-[#e47668] hover:bg-[#2c1d1a] rounded transition-colors"
                                  >
                                    Suspend
                                  </button>
                                )}
                                
                                <select
                                  value={u.role || "user"}
                                  onChange={(e) =>
                                    handleUpdateUserStatus(
                                      u.id,
                                      currentStatus,
                                      e.target.value as any
                                    )
                                  }
                                  className="bg-[#18231c] border border-[#2b3a30] rounded px-2 py-0.5 text-xs text-[#eff3ef] focus:ring-1 focus:ring-[#37634b] outline-none"
                                >
                                  <option value="user">Operator</option>
                                  <option value="farmer">Landowner</option>
                                  <option value="admin">Administrator</option>
                                </select>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
