import React from 'react';

import PostList from './PostList';

function Private() {
  return <PostList type="private" />;
}

export default React.memo(Private);
