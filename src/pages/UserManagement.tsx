import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Mail } from "lucide-react";

const users = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Instructor", status: "Active", courses: 5, avatar: "AJ" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Student", status: "Active", courses: 3, avatar: "BS" },
  { id: 3, name: "Carol Williams", email: "carol@example.com", role: "Admin", status: "Active", courses: 0, avatar: "CW" },
  { id: 4, name: "David Brown", email: "david@example.com", role: "Student", status: "Inactive", courses: 2, avatar: "DB" },
  { id: 5, name: "Eva Martinez", email: "eva@example.com", role: "Instructor", status: "Active", courses: 8, avatar: "EM" },
  { id: 6, name: "Frank Lee", email: "frank@example.com", role: "Student", status: "Active", courses: 4, avatar: "FL" },
];

const roleColors: Record<string, string> = {
  Admin: "bg-accent/10 text-accent",
  Instructor: "bg-info/10 text-info",
  Student: "bg-success/10 text-success",
};

const UserManagement = () => {
  return (
    <DashboardLayout title="User Management">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-9" />
        </div>
        <Button className="gradient-primary text-primary-foreground gap-2 hover:opacity-90">
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Email</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Courses</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0">
                          {user.avatar}
                        </div>
                        <span className="font-medium text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" /> {user.email}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleColors[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <Badge variant={user.status === "Active" ? "default" : "secondary"} className="text-xs">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">{user.courses}</td>
                    <td className="p-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default UserManagement;
