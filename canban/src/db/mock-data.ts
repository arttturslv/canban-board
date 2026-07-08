/** @format */

export interface TaskItemProps {
  id: string;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string | null;
  dueDate: string | null;
  commentsCount: number | null;
}

export interface Task extends TaskItemProps {
  columnId: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export const mockTasks: Task[] = [
  {
    id: "task-1",
    columnId: "todo",
    projectId: "project-1",
    title: "Criar tela de login",
    description: "Implementar design do Figma e integração com Firebase Auth.",
    priority: "high",
    assignee: "Thiago Silva",
    dueDate: "2026-07-15",
    commentsCount: 3,
    createdAt: "2026-07-01T10:00:00Z",
    updatedAt: "2026-07-02T14:30:00Z",
    tags: ["Frontend", "Auth"],
  },
  {
    id: "task-2",
    columnId: "in-progress",
    projectId: "project-1",
    title: "Corrigir vazamento de memória na listagem",
    description:
      "O useEffect da lista de produtos está duplicando as requisições ao scrollar.",
    priority: "urgent",
    assignee: "Aline Costa",
    dueDate: "2026-07-08",
    commentsCount: 5,
    createdAt: "2026-07-05T08:15:00Z",
    updatedAt: "2026-07-07T19:00:00Z",
    tags: ["Bug", "Performance"],
  },
  {
    id: "task-3",
    columnId: "todo",
    projectId: "project-1",

    title: "Escrever testes unitários do helper de datas",
    description: null, // Testando o campo opcional/null
    priority: "low",
    assignee: null, // Sem responsável ainda
    dueDate: null,
    commentsCount: null,
    createdAt: "2026-07-07T11:00:00Z",
    updatedAt: "2026-07-07T11:00:00Z",
    tags: ["Testes"],
  },
  {
    id: "task-4",
    columnId: "done",
    projectId: "project-1",
    title: "Configurar pipeline de CI/CD",
    description:
      "Configurar GitHub Actions para rodar linter e testes automatizados a cada Pull Request.",
    priority: "medium",
    assignee: "Lucas Souza",
    dueDate: "2026-07-04",
    commentsCount: 0,
    createdAt: "2026-06-28T09:00:00Z",
    updatedAt: "2026-07-04T16:20:00Z",
    tags: ["DevOps"],
  },
  {
    id: "task-4",
    columnId: "done",
    projectId: "project-1",
    title: "Configurar pipeline de CI/CD",
    description:
      "Configurar GitHub Actions para rodar linter e testes automatizados a cada Pull Request.",
    priority: "urgent",
    assignee: "Lucas Souza",
    dueDate: "2026-07-04",
    commentsCount: 0,
    createdAt: "2026-06-28T09:00:00Z",
    updatedAt: "2026-07-04T16:20:00Z",
    tags: ["DevOps"],
  },
];
