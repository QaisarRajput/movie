import { Box, HStack, Text, Wrap, useColorModeValue } from '@chakra-ui/react';
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
  const tileBorderColor = useColorModeValue('green.300', 'green.500');
  const tileBg = useColorModeValue('linear(to-br, green.50, white)', 'linear(to-br, green.800, green.700)');
  const tileAccent = useColorModeValue('green.600', 'green.100');
  const tileText = useColorModeValue('gray.800', 'whiteAlpha.900');
  const tileMuted = useColorModeValue('gray.600', 'whiteAlpha.800');

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
            borderColor={tileBorderColor}
            bgGradient={tileBg}
            p={2}
            display="flex"
            flexDir="column"
            justifyContent="space-between"
            transition="all 0.2s ease"
            _hover={{ transform: 'translateY(-2px)', shadow: 'md', borderColor: 'green.400' }}
            key={index}
          >
            <HStack spacing={1} color={tileAccent}>
              <FaMagnet />
              <Text fontSize="10px" fontWeight="bold" letterSpacing="0.4px">
                MAGNET
              </Text>
            </HStack>
            <Text fontSize="xs" fontWeight="semibold" noOfLines={1} color={tileText}>
              {`${torrent.quality}.${torrent.type}`}
            </Text>
            <Text fontSize="10px" opacity={0.85} noOfLines={1} color={tileMuted}>
              {torrent.size}
            </Text>
          </Box>
        );
      })}
    </Wrap>
  );
}
export default MagnetUrl;
