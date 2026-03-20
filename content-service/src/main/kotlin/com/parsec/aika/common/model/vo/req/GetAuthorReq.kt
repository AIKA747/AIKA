package com.parsec.aika.common.model.vo.req

import com.parsec.aika.common.model.em.AuthorSortType
import com.parsec.aika.common.model.vo.PageVo


class GetAuthorReq : PageVo() {

    var keyword: String? = null

    var sort: AuthorSortType? = null

    var username: String? = null

}
