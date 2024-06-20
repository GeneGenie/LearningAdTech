export const _createIframe = (width,height, doc = document) => {
    const iframe = doc.createElement('iframe');
    iframe.width = `${width}px`;
    iframe.height = `${height}px`;
    iframe.scrolling = 'no';
    return iframe
}
