import { signOut } from "next-auth/react";
import LogoutIcon from '@mui/icons-material/Logout';

function SignOutButton() {
    return (
        <button onClick={() => signOut({ callbackUrl: '/' })} className="flex gap-1 items-center self-center mr-8 fixed bottom-12 ">
            <LogoutIcon />
            <h3 >Sign out</h3>
        </button>
    );
}

export default SignOutButton;
