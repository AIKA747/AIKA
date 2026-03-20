import React from 'react';

import PostList from './PostList';

function Follow() {
  return <PostList type="follow" />;
}

export default React.memo(Follow);
