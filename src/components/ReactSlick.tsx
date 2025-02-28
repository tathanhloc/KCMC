
import Slider from "react-slick";
import Styles from "./GlobalStyle.module.scss";
import { SliderData } from "./SliderData";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LinkBtn from "./LinkBtn";


interface Slide {
  id: number;
  describe: string;
  title: string;
  img: string;
}

export default function ReactSlick() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings} className={Styles.ReactSlick}>
      {SliderData.map((slide: Slide) => (
        <div
          key={slide.id}
          className={Styles.SliderContainer}>
    <img src={slide.img} className={Styles.SlideImg}></img>
    <div className={Styles.wrapperSlider}>
            <div className={Styles.SliderTitle}><h1>{slide.title}</h1></div>
            <div className={Styles.SliderDescribe}>{slide.describe}</div>
            <LinkBtn link="#" label="Tìm hiểu thêm"/>
          </div>
         
        </div>
      ))}
    </Slider>
  );
}