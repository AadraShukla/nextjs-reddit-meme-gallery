import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import { PhotoSwipe } from "react-photoswipe";
import styles from "@/styles/Home.module.css";

const Home = () => {
  const [memes, setMemes] = useState([]);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  

  const fetchMemes = async () => {
    try {
       setLoading(true);
       const response = await axios.get(`/api/memes?after=${page}`);
       if (!response.data.data.after) {
         // No more memes to load
         return;
       }
       const newMemes = response.data.data.children.map((child) => {
         const { url, thumbnail } = child.data;
         return {
           src: url, // Set src to the url of the original image
           width: 4,
           height: 3,
           originalImage: { src: url, w: 1200, h: 900 },
         };
       }).filter(newMeme => {
         // Check if the image is already in the memes state
         return !memes.some(existingMeme => existingMeme.originalImage.src === newMeme.originalImage.src);
       });
       setMemes((prevMemes) => [...prevMemes, ...newMemes]);
       setPage((prevPage) => prevPage + 1);
    } catch (error) {
       console.error('Error fetching memes:', error);
    } finally {
       setLoading(false);
    }
   };

   const CustomGallery = ({ photos, onClick }) => {
    return (
       <div className={styles.galleryContainer}>
         {photos.map((photo, index) => (
           photo.src && (
             <img
               key={index}
               src={photo.src}
               alt={`Meme ${index}`}
               onLoad={() => {
                 // Update the src property to the thumbnail URL once the image has been loaded
                 photo.src = photo.originalImage.src;
               }}
               onClick={() => onClick(index)}
               style={{
                width: '300px', // Set the width of the images
                height: '300px', // Set the height of the images
                margin: '30px', // Add some space around the images
                objectFit: 'cover', // Make the images cover their entire container without distorting their aspect ratio
              }}
             />
           )
         ))}
       </div>
    );
   };

  const openPhotoSwipe = (index) => {
    setSelectedImageUrl(memes[index].originalImage.src);
    setIsOpen(true);
  };

  const closePhotoSwipe = () => {
    setSelectedImageUrl('');
    setIsOpen(false);
  };

  const handleScroll = () => {
    if (!loading && window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.offsetHeight) {
      fetchMemes();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    fetchMemes();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Meme Gallery</title>
        <meta name="description" content="A gallery of memes from Reddit" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Meme Gallery</h1>
        </header>
        <div className={styles.galleryContainer}>
          <CustomGallery photos={memes} onClick={openPhotoSwipe} />
        </div>
        {selectedImageUrl && (
          <div className={styles.fullScreenImage} onClick={closePhotoSwipe}>
            <img src={selectedImageUrl} alt="Selected Image" />
          </div>
        )}
        {loading && (
          <div className={styles.loadingMessage}>Loading...</div>
        )}
        <PhotoSwipe
          isOpen={isOpen}
          options={{ index: currentImage }}
          items={memes.map((meme) => ({ src: meme.originalImage.src, w: meme.originalImage.w, h: meme.originalImage.h }))}
          onClose={closePhotoSwipe}
          hideAnimationDuration={0}
          showAnimationDuration={0}
          modalSize='initial'
          bgOpacity={0.8}
        />
      </main>
    </>
  );
};

export default Home;


//module.exports = app; 
