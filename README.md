### Start Local MySQL & Adminer

- `npm run env:up`    - start docker containers
- `npm run db:push`   - push Prisma schema to the database

- use Adminer on `http://localhost:8888/?server=mysql&username=admin&db=db` with password `P@ssw0rd`

### Service

- `npm start`         - start the service

### Stop Local MySQL & Adminer

- `npm run env:down`  - stop docker containers