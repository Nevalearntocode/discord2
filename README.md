# Fullstack Discord Clone: Next.js 14, React, Socket.io, Prisma, Tailwind, PostgreSQL, Auth.js

Current features:

- Authentication using Google/Github/Email (support password change for non-OAuth user) by Auth.js (NextAuth v5)
- Users can change their avatars, names, hashtags (non-OAuth users can change their passwords)
- Add friend with other users through hashtag
- Text/voice/video chat with other users
- Messaging functions are all in real-time for everyone (include send, delete, edit messages)
- Attachments support by using UploadThing
- Infinite loading for messages using tanstack (minor UX improvement by manipulating scrollbar in chat windows)
- Create servers with default roles and channels with creator is the owner (working on changing ownership)
- Invide link allow other users to join your server (if public server, people can join via server slug, else people must have invite link)
- Role system allow members to have permissions for each specific task (manage member, manage message, manage server, role, kick member, etc...)
- Managing members include changing roles and kick for members that have higher role than others
- Create/edit/delete text/voice/video channels
- Open direct one - one conversation with other members through role-based organized member sidebar
- Search specific member/channel if needed
- UI are designed with TailwindCSS and Shadcn/UI
- Mobile and desktop responsivity
- Light / Dark mode
- Websocket fallback: if websocket is failed to connect, trigger polling every second for better UX (visible badges showing websocket current state)
- ORM using Prisma
- PostgreSQL database using Neon (or local)

Planned features:

- Role creations/customizations in server (like a simple version of actual discord)
- Update UI for manage members/servers/roles/channels
- Update UI and functions for landing page include blocked users/pending requests/online friends/all friends (currently only has add friend and show previous conversation)
- Add active/invisible/offline status

### Prerequisites

**Latest LTS node version**

### Cloning the repository

```shell
git clone https://github.com/Nevalearntocode/discord2.git
```

### Install packages

```shell
npm i
```

### Setup .env file

```js
DATABASE_URL=
DIRECT_URL=
AUTH_SECRET=
GITHUB_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
```

### Setup Prisma

Add PostgreSQL Database (Neon or local)

```shell
npx prisma generate
npx prisma db push

```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command | description                              |
| :------ | :--------------------------------------- |
| `dev`   | Starts a development instance of the app |
