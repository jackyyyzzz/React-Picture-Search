import React, { useCallback } from 'react';
import './ImageList.css';
import ImageCard from './ImageCard';

const ImageList = (props) => {
    const lastImageElementRef = useCallback(lastImage => {
        if (lastImage == null) return
        props.onLastImageFound(lastImage.imageRef.current);
    }, [props])

    const images = props.images.map((image, index) => {
        if (index === props.images.length - 1) {
            return <ImageCard ref={lastImageElementRef} key={image.id} image={image} />;
        } else {
            return <ImageCard key={image.id} image={image} />;
        }
    });

    return (<div className="image-list">{images}</div>);
};

export default ImageList;