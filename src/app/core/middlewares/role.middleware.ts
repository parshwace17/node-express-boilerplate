import { Action } from 'routing-controllers';

async function checkRoles(action: Action, roles: string[]) {
    const loggedInUser: any = action.request.user;
    if (!loggedInUser) return false;
    if (loggedInUser && !roles.length) return true;
    if (loggedInUser && roles.indexOf(loggedInUser.role) !== -1) return true;
    return false;
}

export { checkRoles };