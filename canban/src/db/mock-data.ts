/** @format */
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
