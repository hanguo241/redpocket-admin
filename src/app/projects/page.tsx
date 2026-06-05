"use client";

import { useEffect, useState } from "react";
import { fetchProjects, createProject } from "@/lib/api";
import { DataTable, PageHeader } from "@/components";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [error, setError] = useState("");

  const load = () => {
    fetchProjects()
      .then((d) => setProjects(d.projects))
      .catch((e) => setError(e.message));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    const name = prompt("项目名称:");
    if (!name) return;
    try {
      const res = await createProject(name);
      alert(`创建成功!\nAppKey: ${res.app_key}\nAppSecret: ${res.app_secret}`);
      load();
    } catch (e: any) {
      alert("失败: " + e.message);
    }
  };

  const columns = [
    { key: "id", label: "ID", render: (v: string) => <span className="font-mono text-xs">{v.slice(0, 8)}...</span> },
    { key: "name", label: "名称" },
    { key: "app_key", label: "AppKey", render: (v: string) => <span className="font-mono text-xs">{v}</span> },
    { key: "created_at", label: "创建时间", render: (v: string) => <span className="text-xs" style={{ color: "#94A3B8" }}>{new Date(v).toLocaleString()}</span> },
  ];

  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <PageHeader
        title="👥 项目方"
        action={
          <button className="btn-primary" onClick={handleCreate}>+ 新建</button>
        }
      />
      <DataTable columns={columns} data={projects} />
    </div>
  );
}
