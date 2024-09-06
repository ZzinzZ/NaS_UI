"use client"
import { Box, Skeleton, Stack } from '@mui/material'
import React from 'react'

const FriendListOverViewLoading = () => {
  return (
    <Box>
        <Stack spacing={2}>
            <Stack>
                <Skeleton variant="text" width={60} sx={{ fontSize: '1rem' }} />
                <Skeleton variant="text" width={80} sx={{ fontSize: '0.6rem' }} />
            </Stack>
            <Stack direction="row" justifyContent="space-between">
                <Skeleton variant="rounded" width={80} height={80} />
                <Skeleton variant="rounded" width={80} height={80} />
                <Skeleton variant="rounded" width={80} height={80} />
            </Stack>
        </Stack>
    </Box>
  )
}

export default FriendListOverViewLoading