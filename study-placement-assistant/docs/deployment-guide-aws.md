# Deployment Guide — AWS (Person 5)

Two supported paths depending on how much time/budget you have. Start with
Path A for a class project; move to Path B if you want closer-to-production infra.

## Path A — AWS App Runner (simplest, good for a project demo)

1. **Push images to Amazon ECR**
   ```bash
   aws ecr create-repository --repository-name studymate-server
   aws ecr create-repository --repository-name studymate-client

   aws ecr get-login-password --region <region> | \
     docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com

   docker build -t studymate-server ./server
   docker tag studymate-server:latest <account-id>.dkr.ecr.<region>.amazonaws.com/studymate-server:latest
   docker push <account-id>.dkr.ecr.<region>.amazonaws.com/studymate-server:latest

   docker build -t studymate-client ./client --build-arg VITE_API_BASE_URL=https://<server-app-runner-url>/api
   docker tag studymate-client:latest <account-id>.dkr.ecr.<region>.amazonaws.com/studymate-client:latest
   docker push <account-id>.dkr.ecr.<region>.amazonaws.com/studymate-client:latest
   ```

2. **Set up MongoDB Atlas** (free tier is enough): create a cluster, get the
   connection string, whitelist `0.0.0.0/0` for App Runner's dynamic IPs (or
   use a VPC connector for a tighter setup).

3. **Create two App Runner services** (console or CLI):
   - `studymate-server`: image = the server ECR repo, port 5000, env vars
     `OPENAI_API_KEY`, `MONGO_URI` (Atlas string), `CLIENT_ORIGIN` (client's
     App Runner URL once known).
   - `studymate-client`: image = the client ECR repo, port 80. Rebuild the
     client image with `VITE_API_BASE_URL` pointing at the server's App
     Runner URL (App Runner URLs are only known after first deploy — deploy
     server first, then rebuild client).

4. Store secrets in **AWS Secrets Manager** or App Runner's built-in env var
   encryption — never commit `OPENAI_API_KEY` to git.

## Path B — ECS Fargate + ALB (closer to production)

1. Push the same two images to ECR as above.
2. Create an ECS cluster (Fargate launch type).
3. Define two task definitions (server, client), each referencing its ECR
   image, CPU/memory (0.5 vCPU / 1GB is plenty for a demo).
4. Create an Application Load Balancer with two target groups; route
   `/api/*` to the server service, `/*` to the client service.
5. Use **MongoDB Atlas** or **Amazon DocumentDB** for the database.
6. Store `OPENAI_API_KEY` in Secrets Manager and reference it in the task
   definition's `secrets` block (never as a plain environment variable in
   the task definition JSON).

## Security checklist (either path)

- [ ] `OPENAI_API_KEY` is never in the client bundle (it's only used server-side).
- [ ] CORS on the server (`CLIENT_ORIGIN`) is locked to the real client URL, not `*`.
- [ ] MongoDB user has least-privilege access (read/write to `studymate` db only).
- [ ] HTTPS is enforced (App Runner / ALB with ACM certificate do this for you).
- [ ] Rate-limit `/api/chat` (e.g. `express-rate-limit`) to control OpenAI cost.

## What to screenshot for the report

1. Docker Desktop / `docker compose ps` showing all 3 containers healthy.
2. App Runner or ECS console showing both services in "Running" state.
3. The deployed public URL with a live chat exchange.
4. CloudWatch logs showing a successful `/api/chat` request.
