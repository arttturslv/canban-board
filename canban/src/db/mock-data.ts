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
  tag: string;
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
    tag: "Frontend",
  },
  {
    id: "task-2",
    columnId: "doing",
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
    tag: "Bug",
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
    tag: "Testes",
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
    tag: "DevOps",
  },
  {
    id: "task-5",
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
    tag: "DevOps",
  },
];

export interface Column {
  id: string;
  name: string;
  order: number;
  visibility: boolean;
}

export const mockColumns: Column[] = [
  {
    id: "todo",
    name: "To Do",
    order: 0,
    visibility: true,
  },
  {
    id: "doing",
    name: "Doing",
    order: 1,
    visibility: true,
  },
  {
    id: "done",
    name: "Done",
    order: 2,
    visibility: true,
  },
  {
    id: "archive",
    name: "Archived",
    order: 5,
    visibility: false,
  },
];

export const messages = [
  {
    id: "msg-1",
    projectId: "project-1",
    taskId: "task-1",
    authorId: "user-1",
    content: "Criei a estrutura inicial do board.",
    createdAt: "2026-07-08T09:15:00Z",
    editedAt: null,
    readBy: ["user-2", "user-3"],
    attachments: [],
  },
  {
    id: "msg-2",
    projectId: "project-1",
    taskId: "task-1",
    authorId: "user-2",

    content: "Vou revisar o layout hoje à tarde.",
    createdAt: "2026-07-08T09:42:00Z",
    editedAt: null,
    readBy: ["user-1"],
    attachments: [],
  },
  {
    id: "msg-3",
    projectId: "project-1",
    taskId: "task-2",
    authorId: "user-3",

    content: "A API já está retornando as tasks corretamente.",
    createdAt: "2026-07-08T10:20:00Z",
    editedAt: null,
    readBy: ["user-1", "user-2"],
    attachments: [
      {
        id: "att-1",
        name: "swagger.png",
        url: "/attachments/swagger.png",
        size: 325432,
        type: "image/png",
      },
    ],
  },
  {
    id: "msg-4",
    projectId: "project-1",
    taskId: "task-3",
    authorId: "user-1",

    content: "Corrigi os problemas de responsividade do modal.",
    createdAt: "2026-07-08T13:05:00Z",
    editedAt: null,
    readBy: [],
    attachments: [],
  },
  {
    id: "msg-5",
    projectId: "project-1",
    taskId: "task-3",
    authorId: "user-2",

    content: "Perfeito! Vou validar no mobile.",
    createdAt: "2026-07-08T13:12:00Z",
    editedAt: null,
    readBy: ["user-1"],
    attachments: [],
  },
];

export const users = [
  {
    id: "user-1",
    name: "Artur",
    avatar:
      "https://media.licdn.com/dms/image/v2/D4D03AQELAnAYqblCDw/profile-displayphoto-crop_800_800/B4DZ4iT4DCIMAI-/0/1778692101193?e=1785369600&v=beta&t=YP0-pcddqhTBnybmeglwS_Q0fOWN7ASDYY0zjpl0fN8",
  },
  {
    id: "user-2",
    name: "Ana",
    avatar: "...",
  },
  {
    id: "user-3",
    name: "Carlos",
    avatar: "",
  },
];
