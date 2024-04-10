let MyHomeUpdater        = null;
let ProfileUpdater       = null;
let MyProfilePostSync    = null;
let MySyncBookmarkPost   = null;
let MySyncLikePost       = null;
let MySyncCommentCount   = null;

export function setHomeUpdater(myUpdater) {
    MyHomeUpdater = myUpdater;
}

export function UpdateHome() {
    if (MyHomeUpdater !== null)
        MyHomeUpdater();
}

export function setProfileUpdater(updater) {
    ProfileUpdater = updater;
}

export function UpdateSavedPosts() {
    if (ProfileUpdater !== null)
        ProfileUpdater();
}

export function setProfilePostSync(postSync) {
    MyProfilePostSync = postSync;
}

export function ProfilePostSync(PostId) {
    if (MyProfilePostSync !== null)
        MyProfilePostSync(PostId);
}

export function setSyncBookmarkPost(mySyncPost) {
    MySyncBookmarkPost = mySyncPost;
}

export function SyncBookmarkPost(PostId,Status) {
    if (MySyncBookmarkPost !== null)
        MySyncBookmarkPost(PostId,Status)
}

export function setSyncLikePost(mySyncPost) {
    MySyncLikePost = mySyncPost;
}

export function SyncLikePost(PostId,Status,LikeCount) {
    if (MySyncLikePost !== null)
        MySyncLikePost(PostId,Status,LikeCount);
}

export function setSyncCommentCount(mySyncComment) {
    MySyncCommentCount = mySyncComment;
}

export function SyncCommentCount(PostId , CommentCount) {
    if (MySyncCommentCount !== null)
        MySyncCommentCount(PostId,CommentCount);
}