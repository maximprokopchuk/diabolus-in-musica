"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, ShieldOff } from "lucide-react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  async function loadUsers() {
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
  }

  useEffect(() => { loadUsers(); }, []);

  async function toggleRole(userId: string, currentRole: string) {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      toast.success(`Роль изменена на ${newRole}`);
      loadUsers();
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Пользователи</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Имя</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Роль</TableHead>
            <TableHead>Дата регистрации</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name || "—"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                  {user.role === "ADMIN" ? "Админ" : "Ученик"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString("ru")}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleRole(user.id, user.role)}
                  title={user.role === "ADMIN" ? "Снять права" : "Сделать админом"}
                >
                  {user.role === "ADMIN" ? (
                    <ShieldOff className="h-4 w-4" />
                  ) : (
                    <Shield className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
