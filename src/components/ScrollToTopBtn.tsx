import { Button, OverlayTrigger, Tooltip } from 'solid-bootstrap';
import { Component, createEffect, createSignal } from 'solid-js';
import { HiChevronDoubleUp } from 'solidjs-icons/hi';

const ScrollToTopBtn: Component = () => {
  const [isVisible, setIsVisible] = createSignal(false);
  const listenToScroll = () => {
    const heightToHide = 15;
    const windowScrollHeight = document.body.scrollTop || document.documentElement.scrollTop;
    setIsVisible(windowScrollHeight > heightToHide);
  };
  createEffect(() => {
    window.addEventListener('scroll', listenToScroll);
    return () => window.removeEventListener('scroll', listenToScroll);
  });
  return (
    <div class='position-fixed bottom-0 end-0 me-1 mb-1'>
      {isVisible() ? (
        <OverlayTrigger placement='left' overlay={<Tooltip id='scrolltop-tooltip'>Scroll to Top</Tooltip>}>
          <Button
            size='sm'
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            variant='outline-secondary'>
            <HiChevronDoubleUp />
          </Button>
        </OverlayTrigger>
      ) : (
        ''
      )}
    </div>
  );
};

export default ScrollToTopBtn;
