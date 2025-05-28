import GalleryItem from "../galleryItem/galleryItem";
import "./gallery.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import Skeleton from "../skeleton/skeleton"


const fetchPins = async ({ pageParam, search, userId, boardId }) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_ENDPOINT}/pins?cursor=${pageParam}&search=${
      search || ""
    }&userId=${userId || ""}&boardId=${boardId || ""}`
  );
  return res.data;
};

const Gallery = ({ search, userId, boardId }) => {
  const { data, fetchNextPage, hasNextPage, status


   } = useInfiniteQuery({
    queryKey: ["pins", search, userId, boardId],
    queryFn: ({ pageParam = 0 }) =>
      fetchPins({ pageParam, search, userId, boardId }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  if (status === "pending") return <Skeleton />;
  if (status === "error") return "Something went wrong...";

  // Safely flatten pages and handle undefined/null cases
  const allPins = data?.pages?.flatMap((page) => page?.pins || []) || [];

  return (
    <InfiniteScroll
      dataLength={allPins.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<Skeleton />} // Use your Skeleton component here too
      endMessage={
        <p style={{ textAlign: 'center', padding: '20px' }}>
          You've seen all pins!
        </p>
      }
    >
      <div className="gallery">
        {allPins?.map((item) => {
          // Skip rendering if item is invalid
          if (!item?._id) return null;
          
          return <GalleryItem key={item._id} item={item} />;
        })}
      </div>
    </InfiniteScroll>
  );
};

export default Gallery;