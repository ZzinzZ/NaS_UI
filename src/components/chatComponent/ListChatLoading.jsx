import { Skeleton, Stack } from '@mui/material'
import React from 'react'

const ListChatLoading = () => {
  return (
    <Stack spacing={1}>
        <Stack spacing={1} direction="row" alignItems="center">
            <Skeleton variant="circular" width={40} height={40} />
            <Stack>
                <Skeleton variant="rounded" width={100} height={18} />
                <Skeleton variant='text' width={160} height={15}/>
            </Stack>
        </Stack>
        <Stack spacing={1} direction="row" alignItems="center">
            <Skeleton variant="circular" width={40} height={40} />
            <Stack>
                <Skeleton variant="rounded" width={100} height={18} />
                <Skeleton variant='text' width={160} height={15}/>
            </Stack>
        </Stack>
        <Stack spacing={1} direction="row" alignItems="center">
            <Skeleton variant="circular" width={40} height={40} />
            <Stack>
                <Skeleton variant="rounded" width={100} height={18} />
                <Skeleton variant='text' width={160} height={15}/>
            </Stack>
        </Stack>
        <Stack spacing={1} direction="row" alignItems="center">
            <Skeleton variant="circular" width={40} height={40} />
            <Stack>
                <Skeleton variant="rounded" width={100} height={18} />
                <Skeleton variant='text' width={160} height={15}/>
            </Stack>
        </Stack>
        <Stack spacing={1} direction="row" alignItems="center">
            <Skeleton variant="circular" width={40} height={40} />
            <Stack>
                <Skeleton variant="rounded" width={100} height={18} />
                <Skeleton variant='text' width={160} height={15}/>
            </Stack>
        </Stack>
    </Stack>
  )
}

export default ListChatLoading