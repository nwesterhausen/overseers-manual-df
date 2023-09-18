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
      <div class='fixed bottom-0 w-full'>
        <div class='flex justify-center my-2'>
          <div class='join'>
            <button
              class='join-item btn btn-xs'
              classList={{ disabled: rawsContext.pageNum() === 0 }}
              onClick={rawsContext.prevPage}>
              «
            </button>
            <Show when={showFirstPageAndEllipses()}>
              <button
                class='join-item btn btn-xs'
                classList={{ 'btn-primary': rawsContext.pageNum() === 0 }}
                onClick={() => rawsContext.gotoPage(1)}>
                1
              </button>
              <Show when={rawsContext.pageNum() > 6}>
                <button class='join-item btn btn-xs btn-disabled'>...</button>
              </Show>
            </Show>
            <For each={pageNumbers()}>
              {(i) => (
                <button
                  class='join-item btn btn-xs'
                  classList={{ 'btn-primary': rawsContext.pageNum() === i }}
                  onClick={() => rawsContext.gotoPage(i)}>
                  {i}
                </button>
              )}
            </For>
            <Show when={showLastPageAndEllipses()}>
              <Show when={pageNumbers()[pageNumbers().length - 1] + 1 < rawsContext.totalPages()}>
                <button class='join-item btn btn-xs btn-disabled'>...</button>
              </Show>
              <button
                class='join-item btn btn-xs'
                classList={{ disabled: rawsContext.pageNum() === rawsContext.totalPages() }}
                onClick={() => rawsContext.gotoPage(rawsContext.totalPages())}>
                {rawsContext.totalPages()}
              </button>
            </Show>
            <button
              class='join-item btn btn-xs'
              classList={{ disabled: rawsContext.pageNum() === rawsContext.totalPages() }}
              onClick={rawsContext.nextPage}>
              »
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default Pagination;
