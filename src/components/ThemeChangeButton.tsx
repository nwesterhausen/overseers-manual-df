import { Button, OverlayTrigger, Tooltip } from "solid-bootstrap";
import { HiSolidMoon, HiSolidSun } from 'solid-icons/hi';
import { Component } from "solid-js";
import { useThemeChanger } from "../providers/ThemeProvider";

const ThemeChangeButton: Component = () => {
    const [theme, { setDark, setLight }] = useThemeChanger();

    return (
        <OverlayTrigger placement='auto' overlay={<Tooltip>{`Use ${theme.dark ? 'light' : 'dark'} theme`}</Tooltip>}>
            <Button class='border-0 p-1' variant='outline-primary' onClick={() => {
                if (theme.dark) {
                    setLight();
                } else {
                    setDark();
                }
            }}>{theme.dark ? <HiSolidSun size={'1.5rem'} /> : <HiSolidMoon size={'1.5rem'} />}</Button>
        </OverlayTrigger>
    )
}

export default ThemeChangeButton;