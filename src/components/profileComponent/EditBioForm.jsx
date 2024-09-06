import React, { useState } from "react";
import PublicIcon from "@mui/icons-material/Public";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, updateBio } from "@/redux/thunks/profileThunk";

const EditBio = ({profile, CloseBio, user}) => {
    
    const dispatch = useDispatch();
    const [bioValue, setBioValue] = useState('');
    const [isNull, setIsNull] = useState(true);
    const handleChangBio = (e) => {
        setBioValue(e.target.value);
        if(e.target.value.trim() !== ''){
            setIsNull(false);
        } else {
            setIsNull(true);
        }
    }
    const handleUpdateBio = async () => {
        try {
            await dispatch(updateBio({profileId: profile?._id, bio: bioValue}))
            await dispatch(getProfile(user?._id))
        } catch (error) {
            console.log("Update bio error", error);
        }   
        finally{
            CloseBio();
        }
    }

  return (
    <div>
      <Stack>
        <Stack>
          <TextField multiline rows={3} sx={{ background: "#f1f2f6" }} onChange={(e) => handleChangBio(e)} />
          <Typography sx={{fontSize:"0.8rem" , color: "#88888a", textAlign:"end"}}>99 characters left</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1}>
            <PublicIcon />
            <Typography>Public</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button className="grey-profile-button" onClick={CloseBio}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdateBio} disabled={isNull}>Save</Button>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default EditBio;
