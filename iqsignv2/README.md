## Local Development

1. Install dependencies: `npm install`
2. Run frontend server: `npm run dev`

# IQSign Local Development Guide (using Docker)


## Prerequisites
- Docker installed and configured
- Docker daemon running

## Setup Instructions

1. **Prepare Secret Directory**
   Unzip the `secret.zip` file at the root of the repository:
   ```bash
   unzip secret.zip -d .
   ```
   Ensure the `secret` directory is located directly at the root of the project.

2. **Start Docker Daemon**
   Make sure Docker is running on your machine. 
   - On macOS: Open Docker Desktop
   - On Linux: `sudo systemctl start docker`
   - On Windows: Launch Docker Desktop

3. **Launch the Application**
   From the root of the repository, run:
   ```bash
   docker-compose up
   ```
   This command will build and start the IQSign service.

4. **Access the Service**
   Open your web browser and navigate to:
   ```
   http://localhost:5173
   ```
   The IQSign service is now running locally.

## Development Workflow

### Option 1: Local Development with Hot Reloading
1. Make changes to your local files
2. Rebuild the container:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

### Option 2: Editing Code Directly in Container
1. Find the container ID:
   ```bash
   docker ps -a
   ```

2. Enter the container:
   ```bash
   docker exec -it <CONTAINER_ID> /bin/bash
   ```

3. Edit files using `vi`:
   ```bash
   vi /app/iqsign/v2/src/path/to/your/file.js
   ```

### Recommended Workflow
For most development:
- Prefer Option 1 (local changes + rebuild)
- Use Option 2 only for quick fixes or debugging

### Tips
- Ensure you're in the project root when running docker-compose commands
- The local code directory is mounted into the container, so changes are reflected after rebuild

## Troubleshooting
- Ensure all dependencies are installed
- Check that the `secret` directory is correctly placed
- Verify Docker is running before executing `docker-compose up`

## Notes
- The application runs in development mode
- Any changes to the source code will trigger automatic reloading

Enjoy local development!




