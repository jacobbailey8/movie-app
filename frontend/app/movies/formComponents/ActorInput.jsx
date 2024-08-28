'use client';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import AccountCircle from '@mui/icons-material/AccountCircle';
function ActorInput({ actor, setActor }) {
    const handleChange = (event) => {
        setActor(event.target.value);
    };
    return (
        <>
            <h2 className='opacity-50 text-sm font-bold mb-2 mt-4'>Enter Actor Name: </h2>
            <FormControl variant="standard">

                <Input
                    sx={{
                        '&:after': {
                            borderBottomColor: '#FB923C',
                        },
                    }}

                    className='text-sm'
                    id="input-actor"
                    value={actor}
                    onChange={handleChange}
                    startAdornment={
                        <InputAdornment position="start">
                            <AccountCircle />
                        </InputAdornment>
                    }
                />
            </FormControl>

        </>
    )
}

export default ActorInput