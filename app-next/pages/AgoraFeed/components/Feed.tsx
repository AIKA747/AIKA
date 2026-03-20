import React from 'react';

import PostList from './PostList';

function Feed() {
  return <PostList type="feed" />;
}

export default React.memo(Feed);
