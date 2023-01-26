import { Component, For, Show, createMemo } from 'solid-js';
import { useRawsProvider } from '../../providers/RawsProvider';

const Pagination: Component = () => {
  const rawsContext = useRawsProvider();
  const pageNumbers = createMemo(() => {
    if (rawsContext.totalPages() === 1) {
      return [];
    }
    const pageArray: number[] = [];
    let firstNumber = 1;
    if (rawsContext.totalPages() > 10 && rawsContext.pageNum() > 6) {
      firstNumber = rawsContext.pageNum() - 4;
    }
    for (let i = firstNumber; i <= 8 + firstNumber && i <= rawsContext.totalPages(); i++) {
      pageArray.push(i);
    }
    return pageArray;
  });
  const showFirstPageAndEllipses = createMemo(() => {
    return rawsContext.totalPages() > 10 && rawsContext.pageNum() > 6;
  });
  const showLastPageAndEllipses = createMemo(() => {
    return pageNumbers().length > 0 && pageNumbers()[pageNumbers().length - 1] !== rawsContext.totalPages();
  });
  return (
    <Show when={rawsContext.totalPages() > 1}>
      <nav class='py-2'>
        <ul class='pagination justify-content-center'>
          <li class='page-item' classList={{ disabled: rawsContext.pageNum() === 0 }}>
            <a href='#' class='page-link' aria-label='previous' onClick={rawsContext.prevPage}>
              <span aria-hidden='true'>«</span>
            </a>
          </li>
          <Show when={showFirstPageAndEllipses()}>
            <li class='page-item'>
              <a href='#' class='page-link' aria-label='first' onClick={() => rawsContext.gotoPage(1)}>
                <span aria-hidden='true'>1</span>
              </a>
            </li>
            <li class='page-item' style={{ 'pointer-events': 'none' }}>
              <span class='page-link'>…</span>
            </li>
          </Show>
          <For each={pageNumbers()}>
            {(i) => (
              <li class='page-item' classList={{ disabled: rawsContext.pageNum() === i }}>
                <a class='page-link' href='#' onClick={() => rawsContext.gotoPage(i)}>
                  {i}
                </a>
              </li>
            )}
          </For>
          <Show when={showLastPageAndEllipses()}>
            <Show when={pageNumbers()[pageNumbers().length - 1] + 1 < rawsContext.totalPages()}>
              <li class='page-item' style={{ 'pointer-events': 'none' }}>
                <span class='page-link'>…</span>
              </li>
            </Show>
            <li class='page-item'>
              <a
                href='#'
                class='page-link'
                aria-label='last'
                onClick={() => rawsContext.gotoPage(rawsContext.totalPages())}>
                <span aria-hidden='true'>{rawsContext.totalPages()}</span>
              </a>
            </li>
          </Show>
          <li class='page-item' classList={{ disabled: rawsContext.pageNum() === rawsContext.totalPages() }}>
            <a href='#' class='page-link' aria-label='next' onClick={rawsContext.nextPage}>
              <span aria-hidden='true'>»</span>
            </a>
          </li>
        </ul>
      </nav>
    </Show>
  );
};

export default Pagination;
