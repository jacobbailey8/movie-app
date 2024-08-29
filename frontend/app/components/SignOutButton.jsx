import { signOut } from "next-auth/react";

function SignOutButton() {
    return (
        <button onClick={() => signOut({ callbackUrl: '/' })} style={{ padding: '10px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>
            Sign Out
        </button>
    );
}

export default SignOutButton;
