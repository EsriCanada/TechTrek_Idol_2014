   M S B A M L   `   `   `  ����g  cESRI.ArcGIS.OperationsDashboard, Version=10.2.3.0, Culture=neutral, PublicKeyToken=8fc3cc631e44ad86zVclr-namespace:ESRI.ArcGIS.OperationsDashboard;assembly=ESRI.ArcGIS.OperationsDashboardESRI.ArcGIS.OperationsDashboard  5       SolarRoadwaysWidget1   +SolarRoadwaysWidget.Solar_Energy_Calculator   5      \ XPresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35R NWindowsBase, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35W SPresentationCore, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35D 9http://schemas.microsoft.com/winfx/2006/xaml/presentation    5      R NSystem.Xaml, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089:x,http://schemas.microsoft.com/winfx/2006/xaml     5      Jmc;http://schemas.openxmlformats.org/markup-compatibility/2006     5      @d2http://schemas.microsoft.com/expression/blend/2008     5      jopsDashVclr-namespace:ESRI.ArcGIS.OperationsDashboard;assembly=ESRI.ArcGIS.OperationsDashboard     5      $	��417��5   "   .��5	      � $��10q�6	   ��5
   
   
� 5      .��5      �   � Color$  	#FFE8FF00��6    � Offset$
 0.38Q�61   � 5      $  	#FFFFC500��6   $ 1Q�61   5       � RowDefinitions 5   
   �� 5      $
��auto �6   �� 5      $
��auto �6   �� 5      $
��auto �6    � ColumnDefinitions 5      �� 5      $
��auto �6   �� 5      $��* �6   .+�5   
   �� -   5         ��Name$ 	lblPrefix��5      $'��!The selected roads will produce ~��6#   $��1��6O   $
��Left=�6_   $��	10,32,0,0q�6z   $	��Top=�6�   
�������$��16(�6�    J� Effect 5      3  -System.Windows.Media.Effects.DropShadowEffect  5         	Direction$	 275Q�6#      ShadowDepth$ 2Q�63   5      �� 5   
   -   5        $ 	lblSuffix��5      $#��KW/H of electricity per year.��6#   $��1��6K   $
��Left=�6[   $��	10,65,0,0q�6v   $��2��6�   $	��Top=�6�   
�������$��16(�6�    5         5!      $	 275Q�6#      
BlurRadius$ 4Q�63   $ 2Q�6B   	   Color$	 	#FF060606��6R   5#      �� 5$   
   -   5        
 ��Name$
 
blkMeasure��5$      $��1��6(   $
��Left=�68   $��25,4,0,0q�6S   $
��Wrap=�6e   $��0��6y   $	��Top=�6�   $��Tandelle)�6�   $��48(�6�    J� RenderTransformOrigin$ -0.308,0.667&�6�   
�������$��2��6�    5%        5&      $	 275Q�6#   $ 3Q�63   5(      	� 5)   
   -   5         	�Name$ radCars��5)      $��E-Cars��6'   $��1��68   $
��Left=�6H   $��181,116,0,0q�6c   $��2��6x   $	��Top=�6�   $��14(�6�   ���	#FFF7F5F5 5*        5+      $ 4Q�6#   $ 2Q�62   $	 275Q�6B   5-      	� 5.   
   -   5        $ radHomes��5.      $��Homes ��6(   $��1��69   $
��Left=�6I   $��
25,116,0,0q�6d   $��2��6x   $	��Top=�6�    d� 	IsChecked$
 TrueY�6�   
�������$��14(�6�    5/        50      $ 4Q�6#   $	 275Q�62   $ 2Q�6B   52      �� 53   
   -   5        $
 blkInfo��53      $��1��6%   $
��Left=�65   $��10,150,0,-15q�6P   $��2��6f   $
��Wrap=�6s   $	��Top=�6�   
�������$��14(�6�   $	��260��6�   $��73��6�    54        55      $ 4Q�6#   $ 2Q�62   57      9� 58   
   -   5         9�Name$	 exp��58      $��1��6    $��Additional Information��60   $
��Left=�6P   $��10,219,0,-111q�6k   $��2��6�   $	��Top=�6�   $	��103��6�   $	��260��6�   ��. 
���   �.��59      � ��.  5:      �� 5;      $	��12* �6'   �� 5<      $	��58* �6'   �� 5=      $
��133* �6'   �� 5>      $	��55* �6'   .+�5@      �� -   5         ��Name$ 
txtAddInfo��5@      $
��Left=�6.   $��80��6I   $��0,0,-1,0q�6U    �� TextWrapping$
 Wrap=�6g   $	��Top=�6{   $	��259��6�   ��. ���	#FFFBFBFB$��4��6   �� 
IsReadOnly . ��6�   Z� ��6�   Z� .��6.   5A        5B      $ 4Q�6+   $ 2Q�6:   .��5C   &   5D      5E      5F      5I      5J      