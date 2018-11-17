<?php

namespace Drupal\ensemble_migrate\Plugin\migrate\source;

use Drupal\Core\Url;
use Drupal\image\Entity\ImageStyle;
use Drupal\migrate\Plugin\migrate\source\SqlBase;
use Drupal\migrate\Row;

/**
 * Plugin de source pour les articles.
 *
 * @MigrateSource(
 *   id = "ensemble_dc_article"
 * )
 */
class EnsembleArticle extends SqlBase {

  /**
   * {@inheritdoc}
   */
  public function query() {
    $fields = [
      'post_id',
      'cat_id',
      'post_dt',
      'post_tz',
      'post_creadt',
      'post_upddt',
      'post_url',
      'post_title',
      'post_excerpt_xhtml',
      'post_content_xhtml',
      'post_status',
      'post_selected',
      'post_open_tb',
    ];
    return $this->select('dc2_post', 'b')
      ->fields('b', $fields)
      ->condition('post_type', 'post');
  }

  /**
   * {@inheritdoc}
   */
  public function fields() {
    return [
      'post_id' => $this->t('Post ID'),
      'cat_id' => $this->t('Category ID'),
      'post_dt' => $this->t('Actual publication date'),
      'post_tz' => $this->t('Publication timezone'),
      'post_creadt' => $this->t('Alternate publication date'),
      'post_upddt' => $this->t('Last time this post was updated'),
      'post_url' => $this->t('Post path'),
      'post_title' => $this->t('Post title'),
      'post_excerpt_xhtml' => $this->t('Post excerpt'),
      'post_content_xhtml' => $this->t('Post content'),
      'post_status' => $this->t('Post status'),
      'post_selected' => $this->t('Post is selected'),
      'post_open_tb' => $this->t('Trackbacks are open'),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getIds() {
    return [
      'post_id' => [
        'type' => 'integer',
        'alias' => 'post_id',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function prepareRow(Row $row) {
    // Dates sous la forme de timestamps.
    $created = $row->getSourceProperty('post_dt');
    $updated = $row->getSourceProperty('post_upddt');
    $tz = $row->getSourceProperty('post_tz');
    $row->setSourceProperty('post_dt', strtotime($created . ' ' . $tz));
    $row->setSourceProperty('post_upddt', strtotime($updated . ' ' . $tz));

    // Corriger les URL des fichiers incluses directement dans le corps de
    // texte.
    $post_excerpt = $row->getSourceProperty('post_excerpt_xhtml');
    $post_content = $row->getSourceProperty('post_content_xhtml');
    $row->setSourceProperty('post_excerpt_xhtml', $this->correctInlineUrls($post_excerpt));
    $row->setSourceProperty('post_content_xhtml', $this->correctInlineUrls($post_content));
  }

  /**
   * Corriger les URL des fichiers incluses dans le corps de texte.
   */
  protected function correctInlineUrls($text) {
    $text = preg_replace_callback('~(/images/[^"]*/)\.([^/"]*)_(sq|t|s|m)(\.[[:alpha:]]*)~', 'self::dcPathToImageStyle', $text);
    $text = str_replace('"/images/', '"/files/legacy/images/', $text);
    return $text;
  }

  /**
   * Convertir les images annexes de Dotclear.
   *
   * Dotclear calcule pour chaque image I.ext des variantes nommées .I_v.ext,
   * avec v ∈ {sq, t, s, m}. Nous les remplaçons par des appels à des styles
   * d'images.
   */
  public static function dcPathToImageStyle(array $matches) {
    $uri = 'public://legacy' . self::correctFileExtension($matches[1] . $matches[2], $matches[4]);
    $image_style = ImageStyle::load('dotclear_' . $matches[3]);
    $image_uri = $image_style->buildUri($uri);
    // Construire une URL relative. ImageStyle::buildUrl() ne nous est d'aucun
    // secours pour ce que nous voulons faire.
    $token_query = [
      IMAGE_DERIVATIVE_TOKEN => $image_style->getPathToken($uri),
    ];
    $directory_path = \Drupal::service('stream_wrapper.public')->getDirectoryPath();
    $image_url = Url::fromUri('base:/' . $directory_path . '/' . file_uri_target($image_uri), ['query' => $token_query])->toString();

    return $image_url;
  }

  /**
   * Corriger casse de l'extension des fichiers.
   *
   * Les images calculées de Dotclear ont des extensions en minuscules, alors
   * que celle du fichier original peut être en majuscules. Cela pose des
   * problèmes lorsqu'on les transpose sous la forme de styles d'images, ce qui
   * nous force à remonter à l'extension du fichier original pour vérifier sa
   * casse.
   *
   * @var string $path
   *   Chemin (basename + filename), sans extension.
   * @var string $extension
   *   Extension (avec le point).
   *
   * @return string
   *   Nom de fichier avec l'extension correct.
   */
  protected static function correctFileExtension($path, $extension) {
    if (!file_exists('public://legacy' . $path . $extension) && file_exists('public://legacy' . $path . strtoupper($extension))) {
      $extension = strtoupper($extension);
    }

    return $path . $extension;
  }

}
