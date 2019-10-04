import React from 'react';
import unsplash from '../api/unsplash';
import SearchBar from './SearchBar';
import ImageList from './ImageList';
import SearchTab from './SearchTab';
import SearchTabs from './SearchTabs';


class App extends React.Component {
    constructor() {
        super()
        this.term = []
        this.loading = false
    }

    state = {
        images: [],
        pageNumber: 1
    };
    
    onSearchSubmit = async term => {
        if (this.term.includes(term)) {
            return
        }
        this.term.push(term);
        const response = await unsplash.get('/search/photos', {
            params: { 
                query: this.term[this.term.length - 1],
                page: 1
            },
        });

        this.setState({ images: response.data.results, pageNumber: 1 });

        this.createNewTab()
    };

    // createNewTab = () => {
    //     const resetActiveItems = () => {
    //         const activeItems = document.getElementsByClassName('ui top')
    //         for (let i = 0 ; i < activeItems[0].childElementCount ; i++) {
    //             activeItems[0].childNodes[i].classList.remove('active');
    //         };
    //     };

    //     const activeItems = document.getElementsByClassName('ui top')
    //     var tab = document.createElement('div');
    //     tab.setAttribute('class', 'active item');
    //     tab.addEventListener('click', e => {
    //         resetActiveItems();
    //         e.target.classList.add('active');
    //     });

    //     tab.innerHTML = `${this.term[this.term.length - 1]}`
    //     resetActiveItems();
    //     tab.classList.add('active');
    //     activeItems[0].appendChild(tab);
    // }

    onLastImageFound = lastImage => {
        const observer = new IntersectionObserver(entries => {
            if (this.loading) return
            if (entries[0].isIntersecting) {
                this.loading = true
                unsplash.get('/search/photos', {
                    params: {
                        query: this.term[this.term.length - 1],
                        page: this.state.pageNumber + 1
                    }
                }).then(response => {
                    const origImages = [...this.state.images, ...response.data.results];
                    const images = origImages
                        .filter(image => origImages
                            .find(origImage => origImage.id === image.id && image !== origImage
                            ) === undefined
                    )
                    this.setState({
                        images: images,
                        pageNumber: this.state.pageNumber + 1 
                    });
                    this.loading = false
                    observer.disconnect()
                }).catch(e => {
                    console.log(e)
                    observer.disconnect()
                })
            }
        });

        observer.observe(lastImage);
    };
    
    render() {
        return (
            <div className="ui container" style={{ marginTop: '10px'}}>
                <SearchBar onSubmit={this.onSearchSubmit} />
                <SearchTabs searches={['a', 'b']} active="a"></SearchTabs>
                {/* <SearchTab 
                    term={this.term}
                    imageList={<ImageList onLastImageFound={this.onLastImageFound} images={this.state.images}/>}
                /> */}
                
            </div>
        );
    }
}

export default App;