package lan.dk.podcastserver.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lan.dk.podcastserver.utils.jDomUtils;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;

@Table(name = "podcast")
@Entity
public class Podcast implements Serializable {

    private int id;
    private String title;
    private String url;
    private String signature;
    private String type;
    private Timestamp lastUpdate;
    private Collection<Item> items = new ArrayList<Item>();
    private Cover cover;
    private String description;
    private Boolean hasToBeDeleted;

    public Podcast() {
    }

    public Podcast(String title, String url, String signature, String type, Timestamp lastUpdate, Set<Item> items, Cover cover, String description, Boolean hasToBeDeleted) {
        this.title = title;
        this.url = url;
        this.signature = signature;
        this.type = type;
        this.lastUpdate = lastUpdate;
        this.items = (items != null) ? items : this.items ;
        this.cover = cover;
        this.description = description;
        this.hasToBeDeleted = hasToBeDeleted;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Column(name = "type")
    @Basic
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Column(name = "title")
    @Basic
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Column(name = "url", length = 65535)
    @Basic
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Column(name = "signature")
    @Basic
    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    @Column(name = "last_update")
    @Basic
    public Timestamp getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(Timestamp lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    @OneToMany(mappedBy = "podcast", fetch = FetchType.EAGER, cascade=CascadeType.ALL, orphanRemoval=true)
    @OrderBy("pubdate DESC")
    public Collection<Item> getItems() {
        return items;
    }

    public void setItems(Collection<Item> items) {
        this.items = items;
    }

    @OneToOne(fetch = FetchType.EAGER, cascade=CascadeType.ALL, orphanRemoval=true)
    @JoinColumn(name="cover_id")
    public Cover getCover() {
        return cover;
    }

    public void setCover(Cover cover) {
        this.cover = cover;
    }

    @Column(name = "description", length = 65535 )
    @Basic
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Column(name = "hasToBeDeleted")
    @Basic
    public Boolean getHasToBeDeleted() {
        return hasToBeDeleted;
    }

    public void setHasToBeDeleted(Boolean hasToBeDeleted) {
        this.hasToBeDeleted = hasToBeDeleted;
    }

    @Override
    public String toString() {
        return "Podcast{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", url='" + url + '\'' +
                ", signature='" + signature + '\'' +
                ", type='" + type + '\'' +
                ", lastUpdate=" + lastUpdate +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Podcast that = (Podcast) o;

        if (id != that.id) return false;
        if (lastUpdate != null ? !lastUpdate.equals(that.lastUpdate) : that.lastUpdate != null) return false;
        if (signature != null ? !signature.equals(that.signature) : that.signature != null) return false;
        if (title != null ? !title.equals(that.title) : that.title != null) return false;
        if (url != null ? !url.equals(that.url) : that.url != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (title != null ? title.hashCode() : 0);
        result = 31 * result + (url != null ? url.hashCode() : 0);
        result = 31 * result + (signature != null ? signature.hashCode() : 0);
        result = 31 * result + (lastUpdate != null ? lastUpdate.hashCode() : 0);
        return result;
    }

    /* XML Methods */
    @Transient
    @JsonIgnore
    public String toXML(String serveurURL) {
        return jDomUtils.podcastToXMLGeneric(this, serveurURL);
    }
}