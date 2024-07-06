export function createSideBarZH() {
  return [
    {
      text: '2024年',
      collapsed: true,
      items: [
        { text: '第004期 - 最后晚餐', link: '/posts/2024/004' },
        { text: '第003期 - 水母绚舞', link: '/posts/2024/003' },
        { text: '第002期 - 珠海长隆', link: '/posts/2024/002' },
        { text: '第001期 - 田野孤屋', link: '/posts/2024/001' },
        { text: '第000期 - 新的开始', link: '/posts/2024/000' },
      ]
    }
  ]
}

// 英文侧边栏更换格式，否则太占位了
export function createSideBarEN() {
  return [
    {
      text: 'The Year 2024',
      collapsed: true,
      items: [
        { text: 'Vol. 004: The Last Supper', link: '/posts/2024/004' },
        { text: 'Vol. 003: Jellyfish Dance', link: '/posts/2024/003' },
        { text: 'Vol. 002: Chimelong Ocean Kingdom', link: '/posts/2024/002' },
        { text: 'Vol. 001: Solitary House in the Fields', link: '/en/posts/2024/001' },
        { text: 'Vol. 000: A New Beginning', link: '/en/posts/2024/000' },
      ]
    }
  ]
}
