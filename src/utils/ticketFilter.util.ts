export interface TicketSearchModel {
    id: number;
    subject: string;
    description: string;
    author: string;
    assignedTo: string;
    createdOn: string;
    updatedOn: string;
    project?: { id: number; name: string };
    tracker?: { id: number; name: string };
    priority?: { id: number; name: string };
    status?: { id: number; name: string };
    [key: string]: any;
}

interface ParsedQuery {
    exactFilters: Record<string, string>;
    textTokens: string[];
}


const parseGitLabQuery = (query: string): ParsedQuery => {
    const exactFilters: Record<string, string> = {};
    const textTokens: string[] = [];

    const normalized = query.replace(/\s*(&&|\bAND\b)\s*/gi, " ");

    const tokenRegex = /(?:(\w+)[:=](?:"([^"]+)"|(\S+)))|(?:"([^"]+)"|(\S+))/g;

    let match: RegExpExecArray | null;
    while ((match = tokenRegex.exec(normalized)) !== null) {
        const key = match[1]?.toLowerCase();
        const keyValue = match[2] ?? match[3];
        const freeText = match[4] ?? match[5];

        if (key && keyValue !== undefined) {
            exactFilters[key] = keyValue.trim().toLowerCase();
        } else if (freeText) {
            textTokens.push(freeText.trim().toLowerCase());
        }
    }

    return { exactFilters, textTokens };
};


export const matchesTicketQuery = (
    ticket: TicketSearchModel,
    searchQuery: string
): boolean => {
    if (!searchQuery || searchQuery.trim() === "") {
        return true;
    }

    const { exactFilters, textTokens } = parseGitLabQuery(searchQuery);
    for (const [key, expected] of Object.entries(exactFilters)) {
        switch (key) {
            case "id":
                if (String(ticket.id).toLowerCase() !== expected) return false;
                break;
            case "subject":
                if (!ticket.subject?.toLowerCase().includes(expected)) return false;
                break;
            case "description":
                if (!ticket.description?.toLowerCase().includes(expected)) return false;
                break;
            case "author":
                if (!ticket.author?.toLowerCase().includes(expected)) return false;
                break;
            case "assignedto":
            case "assigned_to":
            case "assignee":
                if (!ticket.assignedTo?.toLowerCase().includes(expected)) return false;
                break;
            case "createdon":
            case "created_on":
                if (!ticket.createdOn?.toLowerCase().includes(expected)) return false;
                break;
            case "updatedon":
            case "updated_on":
                if (!ticket.updatedOn?.toLowerCase().includes(expected)) return false;
                break;

            case "status":
                if (ticket.status?.name?.trim().toLowerCase() !== expected) return false;
                break;
            case "priority":
                if (ticket.priority?.name?.trim().toLowerCase() !== expected) return false;
                break;
            case "project":
                if (ticket.project?.name?.trim().toLowerCase() !== expected) return false;
                break;
            case "tracker":
                if (ticket.tracker?.name?.trim().toLowerCase() !== expected) return false;
                break;

            default:
                return false;
        }
    }

    for (const token of textTokens) {
        const matchesAnyField =
            String(ticket.id).toLowerCase().includes(token) ||
            (ticket.subject?.toLowerCase().includes(token) ?? false) ||
            (ticket.description?.toLowerCase().includes(token) ?? false) ||
            (ticket.author?.toLowerCase().includes(token) ?? false) ||
            (ticket.assignedTo?.toLowerCase().includes(token) ?? false) ||
            (ticket.createdOn?.toLowerCase().includes(token) ?? false) ||
            (ticket.updatedOn?.toLowerCase().includes(token) ?? false) ||
            (ticket.status?.name?.toLowerCase().includes(token) ?? false) ||
            (ticket.priority?.name?.toLowerCase().includes(token) ?? false) ||
            (ticket.project?.name?.toLowerCase().includes(token) ?? false) ||
            (ticket.tracker?.name?.toLowerCase().includes(token) ?? false);

        if (!matchesAnyField) {
            return false;
        }
    }

    return true;
};