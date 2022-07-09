import { Button, OverlayTrigger, Tooltip } from 'solid-bootstrap';
import { Component, createEffect, createSignal } from 'solid-js';
import { HiSolidChevronDoubleUp } from 'solid-icons/hi';

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
    <div class='position-fixed top-0 end-0 me-1 mt-1'>
      {isVisible() ? (
        <OverlayTrigger placement='left' overlay={<Tooltip id='scrolltop-tooltip'>Scroll to Top</Tooltip>}>
          <Button
            size='sm'
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            variant='outline-secondary'>
            <HiSolidChevronDoubleUp />
          </Button>
        </OverlayTrigger>
      ) : (
        ''
      )}
    </div>
  );
};

export default ScrollToTopBtn;
