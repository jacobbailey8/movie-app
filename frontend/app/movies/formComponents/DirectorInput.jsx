'use client';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import AccountCircle from '@mui/icons-material/AccountCircle';
function DirectorInput({ director, setDirector }) {
    const handleChange = (event) => {
        setDirector(event.target.value);
    };
    return (
        <>
            <h2 className='opacity-50 text-sm font-bold mb-2 mt-4'>Enter Director Name: </h2>
            <FormControl variant="standard">

                <Input
                    sx={{
                        '&:after': {
                            borderBottomColor: '#FB923C',
                        },
                    }}
                    className="text-sm" id="input-director"
                    value={director}
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

export default DirectorInput