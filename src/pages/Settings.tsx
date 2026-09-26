import React, { useState, useEffect } from "react";
import AppLayout from "../components/Layout";
import { useAuth } from "../lib/auth-context";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  UserCheck,
  UserX,
  Clock,
  Shield,
} from "lucide-react";
import { useTranslation } from "../lib/i18n";

interface ManagedUser {
  id: string;
  email: string;
  role: "admin" | "user" | "farmer";
  status: "approved" | "pending" | "rejected";
  name?: string;
  createdAt?: string;
}

export default function SettingsPage() {
  const { user, role } = useAuth();
  const { t } = useTranslation();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    if (role !== "admin") return;
    setLoadingUsers(true);
    try {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const fetched: ManagedUser[] = [];
      querySnapshot.forEach((d) => {
        fetched.push({ id: d.id, ...d.data() } as ManagedUser);
      });
      setUsers(fetched);
    } catch (e) {
      console.error("Error fetching users:", e);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const handleUpdateUserStatus = async (
    targetUserId: string,
    newStatus: "approved" | "rejected",
    newRole?: "admin" | "user" | "farmer"
  ) => {
    try {
      const updateData: any = { status: newStatus };
      if (newRole) updateData.role = newRole;

      await updateDoc(doc(db, "users", targetUserId), updateData);
      setActionMessage(`Account updated successfully.`);
      setTimeout(() => setActionMessage(null), 3000);
      fetchUsers();
    } catch (err: any) {
      console.error("Error updating user:", err);
      setActionMessage(`Error: ${err.message}`);
    }
  };

  const pendingUsers = users.filter((u) => u.status === "pending" || !u.status);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Header */}
        <div className="pb-3 border-b border-[#e5e2da] dark:border-[#212c24] flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#181c19] dark:text-[#eff3ef]">
              {t('settings.title')}
            </h1>
            <p className="text-xs text-[#58615a] dark:text-[#95a398] mt-0.5">
              {t('settings.subtitle')}
            </p>
          </div>
        </div>

        {actionMessage && (
          <div className="p-3 bg-[#18261e] border border-[#2b4c38] text-[#8ed4a7] text-xs rounded-xs">
            {actionMessage}
          </div>
        )}

        {/* Current User Card */}
        <div className="rounded-xs border border-[#e5e2da] dark:border-[#222f26] bg-white dark:bg-[#141d17] p-5">
          <h2 className="text-sm font-semibold text-[#181c19] dark:text-[#eff3ef] mb-3 pb-2 border-b border-[#eeebe3] dark:border-[#1d2920]">
            {t('settings.userProfile')}
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xs bg-[#543d2c] text-[#f2ede4] flex items-center justify-center font-bold text-sm uppercase font-mono">
              {user?.email ? user.email[0] : "U"}
            </div>
            <div>
              <div className="text-sm font-semibold text-[#181c19] dark:text-[#eff3ef]">
                {user?.email}
              </div>
              <span className="text-xs text-[#58615a] dark:text-[#95a398] flex items-center gap-1.5 mt-0.5">
                <Shield className="w-3.5 h-3.5 text-[#1f4230] dark:text-[#82c499]" />
                <span className="capitalize font-mono">
                  {role === "admin"
                    ? t('nav.administrator')
                    : role === "farmer"
                    ? t('nav.landowner')
                    : t('nav.fieldOperator')}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Pending Requests Alert & Approval Panel */}
        {role === "admin" && pendingUsers.length > 0 && (
          <div className="rounded-xs border border-[#523e25] bg-[#1f1911] p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#382b1b]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#e0a86b]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {t('settings.pendingApprovals')} ({pendingUsers.length})
                </h3>
              </div>
              <span className="text-[11px] text-[#dca364]">
                {t('settings.directAccessBlocked')}
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
                      Name: {pUser.name || "N/A"} · Registered:{" "}
                      {pUser.createdAt ? new Date(pUser.createdAt).toLocaleDateString() : "Recent"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateUserStatus(pUser.id, "approved", "user")}
                      className="px-2.5 py-1 text-xs font-semibold bg-[#1f4230] hover:bg-[#28573f] text-white rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <UserCheck className="w-3 h-3 text-[#79c294]" />
                      <span>{t('settings.approveOperator')}</span>
                    </button>

                    <button
                      onClick={() => handleUpdateUserStatus(pUser.id, "approved", "farmer")}
                      className="px-2.5 py-1 text-xs font-medium bg-[#1e2f24] hover:bg-[#253d2f] text-[#a5cbb4] rounded-xs transition-colors cursor-pointer"
                    >
                      {t('settings.approveLandowner')}
                    </button>

                    <button
                      onClick={() => handleUpdateUserStatus(pUser.id, "rejected")}
                      className="px-2 py-1 text-xs text-[#e47668] hover:bg-[#381c18] rounded-xs transition-colors cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5 inline mr-1" />
                      {t('settings.reject')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Management Table for Admin */}
        {role === "admin" && (
          <div className="rounded-xs border border-[#e5e2da] dark:border-[#222f26] bg-white dark:bg-[#141d17] overflow-hidden">
            <div className="p-4 border-b border-[#e5e2da] dark:border-[#212c24] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[#181c19] dark:text-[#eff3ef]">
                  {t('settings.userDirectory')}
                </h2>
                <p className="text-xs text-[#58615a] dark:text-[#95a398]">
                  Enforce operational role-based access control.
                </p>
              </div>
              <button
                onClick={fetchUsers}
                className="px-2.5 py-1 text-xs font-medium border border-[#27382c] text-[#869e90] hover:text-white rounded-xs transition-colors cursor-pointer"
              >
                Refresh
              </button>
            </div>

            {loadingUsers ? (
              <div className="p-8 text-center text-xs text-[#58615a] dark:text-[#95a398]">
                Loading directory records...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] font-semibold text-[#6e7770] dark:text-[#8c9c90] uppercase tracking-wider bg-[#f8f8f5] dark:bg-[#111813] border-b border-[#e5e2da] dark:border-[#212c24]">
                    <tr>
                      <th className="px-4 py-2.5">{t('settings.emailCol')}</th>
                      <th className="px-4 py-2.5">{t('settings.nameCol')}</th>
                      <th className="px-4 py-2.5">{t('settings.statusCol')}</th>
                      <th className="px-4 py-2.5">{t('settings.roleCol')}</th>
                      <th className="px-4 py-2.5 text-right">{t('settings.actionCol')}</th>
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
                              <span className="ml-2 text-[10px] font-sans px-1.5 py-0.2 rounded-xs bg-[#2e4033] text-[#9ed4b2]">
                                Root Admin
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-[#cad6cd]">
                            {u.name || "N/A"}
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-xs text-[11px] font-medium border ${
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
                                    className="px-2 py-1 text-[11px] font-semibold bg-[#1f4230] hover:bg-[#28573f] text-white rounded-xs transition-colors cursor-pointer"
                                  >
                                    Grant Access
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateUserStatus(u.id, "rejected", u.role || "user")}
                                    className="px-2 py-1 text-[11px] text-[#e47668] hover:bg-[#381c18] rounded-xs transition-colors cursor-pointer"
                                  >
                                    Suspend
                                  </button>
                                )}
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
