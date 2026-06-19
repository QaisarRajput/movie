import { Box, HStack, Text, Wrap } from '@chakra-ui/react';
import { FaMagnet } from 'react-icons/fa';

const trackerUrls = ["udp://open.demonii.com:1337/announce",
                    "udp://tracker.openbittorrent.com:80",
                    "udp://tracker.coppersurfer.tk:6969",
                    "udp://glotorrents.pw:6969/announce",
                    "udp://tracker.opentrackr.org:1337/announce",
                    "udp://torrent.gresille.org:80/announce",
                    "udp://p4p.arenabg.com:1337",
                    "udp://tracker.leechers-paradise.org:6969"]; // Your list of tracker URLs

function generateMagnetLink(torrent, movie) {
  const { hash, quality, type, size } = torrent;
  const displayName = `${movie}.${quality}.${type} (${size})`;
  const trackersParam = trackerUrls.map(trackerUrl => `tr=${encodeURIComponent(trackerUrl)}`).join('&');
  return `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(displayName)}&${trackersParam}`;
}

function MagnetUrl({ torrents , movie}) {
  return (
    <Wrap spacing={2} wrap="wrap" align="start" w="full">
      {torrents.map((torrent, index) => {
        const magnetLink = generateMagnetLink(torrent, movie);
        return (
          <Box
            as="a"
            href={magnetLink}
            w={{ base: '108px', sm: '120px' }}
            h={{ base: '78px', sm: '84px' }}
            rounded="lg"
            borderWidth="1px"
            borderColor="green.300"
            bgGradient="linear(to-br, green.50, white)"
            p={2}
            display="flex"
            flexDir="column"
            justifyContent="space-between"
            transition="all 0.2s ease"
            _hover={{ transform: 'translateY(-2px)', shadow: 'md', borderColor: 'green.400' }}
            key={index}
          >
            <HStack spacing={1} color="green.600">
              <FaMagnet />
              <Text fontSize="10px" fontWeight="bold" letterSpacing="0.4px">
                MAGNET
              </Text>
            </HStack>
            <Text fontSize="xs" fontWeight="semibold" noOfLines={1}>
              {`${torrent.quality}.${torrent.type}`}
            </Text>
            <Text fontSize="10px" opacity={0.75} noOfLines={1}>
              {torrent.size}
            </Text>
          </Box>
        );
      })}
    </Wrap>
  );
}
export default MagnetUrl;
