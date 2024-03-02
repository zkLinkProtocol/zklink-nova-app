import styled from 'styled-components'

const BgBox = styled.div`
    /* position: fixed;
    top: 0;
    left: 0; */
    min-height: 100%;
    width: 100%;
    /* min-width: 1680px; */
    /* background: url('/img/bg-home.png') no-repeat; */

    background-image: image-set('/img/bg-home.png' 0.5x, '/img/bg-home.png' 1x, '/img/bg-home.png' 2x);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50%;

    /* transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(.4,0,.2,1);
    transition-duration: .15s; */

    /* background-image: url('/img/bg-home.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    background-color: #464646; */
`

export default function Home() {
    return (
        <BgBox>
        </BgBox>
    )
}
