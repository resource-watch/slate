## Vocabularies and tags

Vocabularies and tags are the two central pillars of the RW API's tagging mechanism, so we'll be covering them together. These concepts can seem abstract at times, so it's important that you understand the concepts we'll describe here, before moving on to the documentation for the actual endpoints.

### Tags

Let's start with an example: you are browsing some old files on your computer, and you run into your MP3 collection from when you were a teenager. You re-discover some great tunes from way back when, but you also rediscover how unorganized you were, so you decide to curate your music collection a bit, for old times sake. So, as you listen to those "dusty" files, you start adding keywords to each file, like "rock", "slow one" or "1996", that describe each song, and help you structure and organize your collection. You are adding **tags** to your files.

Like in our example, a RW API tag is a simple word or a concept, that is used to describe a resource. In the RW API, a resource can be a dataset, a widget, or a layer (MP3 files currently not supported, sorry). While a tag can be whatever you want, they are most useful if they capture simple concepts that apply to multiple resources. So, while "rock", "slow one" and "1996" are three good tags for your music collection, a tag like "slow rock song from 1996" is probably too specific, and wouldn't work well as a tag - we'll see why in a moment.

Now that you have your tags in place, your music collection is starting to feel a lot more organized. You notice you can quickly group similar songs, and create playlists like "pop songs" or "95s punk", and you can even use tags to find songs that match your current mood, that you didn't remember you had in your collection. Tags are really powerful to discover resources you didn't know existed - whether it's "pop" songs, "deforestation" datasets, or "social inequality" layers. 

RW API tags are shared by all users, meaning any user can discover your resources if they search by the tags you assigned to them. Similarly, you can use tags to discover resources created and tagged by other users, so id adds discoverability value both ways.

However, this simple tag mechanism has a few downsides, so you can't simply add individual tags to RW API resources. You need to use vocabularies.


### Vocabulary

Let's go back to your music collection. As you realize tags are a powerful tool to curate your collection, you start adding more tags to your songs. Soon you realize that every file now has many many tags, and it's starting to become complicated to make sense of each of the 20 tags you've now added to your songs - you're no longer sure if the "1996" refers to the year it was recorded, released, or remastered. You play songs tagged with "brainstorm" and start thinking about a way to solve this problem.

You realize the problem you're facing could be solved by grouping tags in a way that identifies what they refer to. So, for example, you could have tag groups called "year of release", "instruments played" or "genre". Each song could use as many or as few tags from each tag group, and tags with the same name but belonging to different groups would effectively mean and be different things. When associating a tag with a song, you would need to identify which tag group that tag belongs to, to make it work. Finally, you realize that "tag groups" is a poor name, and decide to call it something else - **vocabulary**.

As in our example above, RW API vocabularies are a way to group multiple tags in a way that makes it easier to organize them, while also giving them more meaning. When tagging a RW API resource, not only do you need to specify the tag values but also the vocabulary to which each tag belongs - giving context to your tags and making them more powerful and easier to understand. Like with tags, vocabularies are also shared by all RW API users, which benefits everyone in terms of discoverability.
