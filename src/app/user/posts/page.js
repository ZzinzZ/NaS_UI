import PostPageContent from '@/components/feedPageComponent/PostPageContent'
import { Container } from '@mui/material'
import React from 'react'

const PostPage = () => {
  return (
    <Container sx={{marginTop:{md: 0, xs: "3rem", sm:"3rem"}}}><PostPageContent/></Container>
  )
}

export default PostPage