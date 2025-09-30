import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController } from "./core-utils";
/**
 * DO NOT MODIFY THIS FUNCTION. Only for your reference.
 */
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    // Use this API for conversations. **DO NOT MODIFY**
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
        const sessionId = c.req.param('sessionId');
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId); // Get existing agent or create a new one if it doesn't exist, with sessionId as the name
        const url = new URL(c.req.url);
        url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
        return agent.fetch(new Request(url.toString(), {
            method: c.req.method,
            headers: c.req.header(),
            body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
        }));
        } catch (error) {
        console.error('Agent routing error:', error);
        return c.json({
            success: false,
            error: API_RESPONSES.AGENT_ROUTING_FAILED
        }, { status: 500 });
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Add your routes here
    /**
     * List all candidates
     * GET /api/candidates
     */
    app.get('/api/candidates', async (c) => {
        try {
            const controller = getAppController(c.env);
            const candidates = await controller.listCandidates();
            return c.json({ success: true, data: candidates });
        } catch (error) {
            console.error('Failed to list candidates:', error);
            return c.json({
                success: false,
                error: 'Failed to retrieve candidates'
            }, { status: 500 });
        }
    });
    /**
     * Create a new candidate
     * POST /api/candidates
     * Body: { name: string, position: string }
     */
    app.post('/api/candidates', async (c) => {
        try {
            const { name, position } = await c.req.json();
            if (!name || !position) {
                return c.json({
                    success: false,
                    error: 'Name and position are required'
                }, { status: 400 });
            }
            const controller = getAppController(c.env);
            const newCandidate = await controller.addCandidate(name, position);
            return c.json({
                success: true,
                data: newCandidate
            }, { status: 201 });
        } catch (error) {
            console.error('Failed to create candidate:', error);
            return c.json({
                success: false,
                error: 'Failed to create candidate'
            }, { status: 500 });
        }
    });
    /**
     * Get a single candidate
     * GET /api/candidates/:candidateId
     */
    app.get('/api/candidates/:candidateId', async (c) => {
        try {
            const candidateId = c.req.param('candidateId');
            const controller = getAppController(c.env);
            const candidate = await controller.getCandidate(candidateId);
            if (!candidate) {
                return c.json({ success: false, error: 'Candidate not found' }, { status: 404 });
            }
            return c.json({ success: true, data: candidate });
        } catch (error) {
            console.error('Failed to get candidate:', error);
            return c.json({
                success: false,
                error: 'Failed to retrieve candidate'
            }, { status: 500 });
        }
    });
}